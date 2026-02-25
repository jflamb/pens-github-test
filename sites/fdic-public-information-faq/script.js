const state = {
  data: null,
  query: "",
  selectedTopicId: "__all__",
  activeTreeItemId: "__all__",
  activeFaqItemId: null,
  allTopics: [],
  searchDebounceId: null,
};

const SEARCH_DEBOUNCE_MS = 200;
const TREE_BASE_INDENT_PX = 16;
const TREE_DEPTH_INDENT_PX = 16;
const SEARCH_SCORE_WEIGHTS = {
  questionToken: 7,
  topicToken: 5,
  summaryToken: 3,
  answerToken: 1,
  questionExact: 12,
  topicExact: 8,
};

const els = {
  search: document.getElementById("faq-search"),
  searchInlineClear: document.getElementById("faq-search-inline-clear"),
  clear: document.getElementById("clear-search"),
  resultCount: document.getElementById("result-count"),
  categoryTree: document.getElementById("category-tree"),
  faqList: document.getElementById("faq-list"),
};

init();

async function init() {
  try {
    const response = await fetch("data.json");
    state.data = await response.json();
    state.allTopics = flattenTopics(state.data.categories);
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q");
    if (initialQuery) {
      state.query = initialQuery.trim();
      els.search.value = state.query;
    }

    wireEvents();
    updateInlineClearVisibility();
    render();
    openByHash();
  } catch (error) {
    console.error(error);
    els.resultCount.textContent = "Unable to load FAQ content.";
  }
}

function wireEvents() {
  els.search.addEventListener("input", () => {
    if (state.searchDebounceId) {
      clearTimeout(state.searchDebounceId);
    }
    updateInlineClearVisibility();
    state.searchDebounceId = setTimeout(() => {
      state.query = els.search.value.trim();
      render();
    }, SEARCH_DEBOUNCE_MS);
  });

  els.searchInlineClear.addEventListener("click", () => {
    els.search.value = "";
    state.query = "";
    updateInlineClearVisibility();
    render();
    els.search.focus();
  });

  els.clear.addEventListener("click", () => {
    els.search.value = "";
    state.query = "";
    updateInlineClearVisibility();
    render();
  });

  window.addEventListener("hashchange", openByHash);
  els.categoryTree.addEventListener("keydown", handleCategoryTreeKeydown);
  els.faqList.addEventListener("keydown", handleFaqListKeydown);
  els.faqList.addEventListener("focusin", handleFaqListFocusIn);
  els.faqList.addEventListener("click", handleFaqListClick);
}

function updateInlineClearVisibility() {
  els.searchInlineClear.hidden = !els.search.value;
}

function flattenTopics(items, depth = 0, parentId = null, list = []) {
  for (const item of items) {
    list.push({
      id: item.id,
      label: item.label,
      depth,
      parentId,
    });
    if (item.items && item.items.length) {
      flattenTopics(item.items, depth + 1, item.id, list);
    }
  }
  return list;
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function isBulletLine(text) {
  return /^\s*(?:•|●|▪|◦|·||-)\s*/.test(text || "");
}

function stripBulletPrefixFromLineHtml(lineHtml) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = lineHtml;

  if (wrapper.firstChild && wrapper.firstChild.nodeType === Node.TEXT_NODE) {
    wrapper.firstChild.textContent = wrapper.firstChild.textContent.replace(/^\s*(?:•|●|▪|◦|·||-)\s*/, "");
  } else {
    wrapper.innerHTML = wrapper.innerHTML.replace(
      /^\s*(?:&nbsp;|\u00a0)*(?:&bull;|&#8226;|•|●|▪|◦|·||-)\s*/i,
      "",
    );
  }

  return wrapper.innerHTML.trim();
}

function buildSemanticFragmentFromLines(lineParts) {
  const fragment = document.createDocumentFragment();
  let paragraphBuffer = [];
  let listBuffer = [];

  const flushParagraph = () => {
    if (!paragraphBuffer.length) return;
    const p = document.createElement("p");
    p.innerHTML = paragraphBuffer.join("<br>");
    fragment.appendChild(p);
    paragraphBuffer = [];
  };

  const flushList = () => {
    if (!listBuffer.length) return;
    const ul = document.createElement("ul");
    for (const item of listBuffer) {
      const li = document.createElement("li");
      li.innerHTML = item;
      ul.appendChild(li);
    }
    fragment.appendChild(ul);
    listBuffer = [];
  };

  for (const line of lineParts) {
    if (!line) continue;
    if (isBulletLine(stripHtml(line))) {
      flushParagraph();
      listBuffer.push(stripBulletPrefixFromLineHtml(line));
    } else {
      flushList();
      paragraphBuffer.push(line);
    }
  }

  flushParagraph();
  flushList();
  return fragment;
}

function semanticizeAnswerHtml(answerHtml) {
  const root = document.createElement("div");
  root.innerHTML = answerHtml || "";
  stripLeadingAnswerPrefix(root);

  for (const paragraph of root.querySelectorAll("p")) {
    const lineParts = paragraph.innerHTML.split(/<br\s*\/?>/i).map((line) => line.trim());
    const bulletLines = lineParts.filter((line) => isBulletLine(stripHtml(line)));

    if (bulletLines.length < 2) continue;
    paragraph.replaceWith(buildSemanticFragmentFromLines(lineParts));
  }

  // Some answers are raw text with <br> bullet lines and no <p> wrappers.
  if (!root.querySelector("p, ul, ol, li")) {
    const lineParts = root.innerHTML.split(/<br\s*\/?>/i).map((line) => line.trim());
    const bulletLines = lineParts.filter((line) => isBulletLine(stripHtml(line)));
    if (bulletLines.length >= 2) {
      root.replaceChildren(buildSemanticFragmentFromLines(lineParts));
    }
  }

  // Normalize media/link URLs from source HTML so they work outside ask.fdic.gov.
  for (const img of root.querySelectorAll("img[src]")) {
    const src = img.getAttribute("src") || "";
    if (src.startsWith("/")) {
      img.setAttribute("src", `https://ask.fdic.gov${src}`);
    }
  }

  for (const link of root.querySelectorAll("a[href]")) {
    const href = link.getAttribute("href") || "";
    if (href.startsWith("/")) {
      link.setAttribute("href", `https://ask.fdic.gov${href}`);
    }
  }

  return root.innerHTML;
}

function stripLeadingAnswerPrefix(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node) {
    const value = node.nodeValue || "";
    if (value.trim()) {
      node.nodeValue = value.replace(/^\s*A:\s*/i, "");
      break;
    }
    node = walker.nextNode();
  }
}

function normalizeText(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeQuery(query) {
  if (!query) return [];
  return normalizeText(query).split(" ").filter(Boolean);
}

function getArticleSearchData(article) {
  const topicText = article.topics.map((topic) => topic.label).join(" ");
  return {
    question: normalizeText(article.question),
    topicText: normalizeText(topicText),
    summary: normalizeText(article.summary || ""),
    answer: normalizeText(stripHtml(article.answerHtml || "")),
  };
}

function evaluateQueryMatch(article, tokens, normalizedQuery) {
  if (!tokens.length) return { matches: true, score: 0 };

  const fields = getArticleSearchData(article);
  const combined = `${fields.question} ${fields.topicText} ${fields.summary} ${fields.answer}`;

  for (const token of tokens) {
    if (!combined.includes(token)) {
      return { matches: false, score: 0 };
    }
  }

  let score = 0;
  for (const token of tokens) {
    if (fields.question.includes(token)) score += SEARCH_SCORE_WEIGHTS.questionToken;
    if (fields.topicText.includes(token)) score += SEARCH_SCORE_WEIGHTS.topicToken;
    if (fields.summary.includes(token)) score += SEARCH_SCORE_WEIGHTS.summaryToken;
    if (fields.answer.includes(token)) score += SEARCH_SCORE_WEIGHTS.answerToken;
  }

  if (normalizedQuery && fields.question.includes(normalizedQuery)) score += SEARCH_SCORE_WEIGHTS.questionExact;
  if (normalizedQuery && fields.topicText.includes(normalizedQuery)) score += SEARCH_SCORE_WEIGHTS.topicExact;

  return { matches: true, score };
}

function filterArticles() {
  const query = state.query;
  const tokens = tokenizeQuery(query);
  const normalizedQuery = normalizeText(query);
  const hasTopicFilter = state.selectedTopicId !== "__all__";
  const ranked = [];

  for (const article of state.data.articles) {
    const matchesTopic = !hasTopicFilter || article.topics.some((topic) => topic.id === state.selectedTopicId);
    if (!matchesTopic) continue;

    const { matches, score } = evaluateQueryMatch(article, tokens, normalizedQuery);
    if (!matches) continue;

    ranked.push({ article, score });
  }

  ranked.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.article.question.localeCompare(b.article.question);
  });

  return ranked.map((entry) => entry.article);
}

function topicCountsForQuery() {
  const counts = new Map();
  const query = state.query;
  const tokens = tokenizeQuery(query);
  const normalizedQuery = normalizeText(query);

  for (const article of state.data.articles) {
    const { matches } = evaluateQueryMatch(article, tokens, normalizedQuery);
    if (!matches) continue;

    for (const topic of article.topics) {
      counts.set(topic.id, (counts.get(topic.id) || 0) + 1);
    }
  }

  return counts;
}

function render() {
  const filteredArticles = filterArticles();
  renderResultCount(filteredArticles.length);
  renderCategoryTree(topicCountsForQuery());
  renderFaqList(filteredArticles);
}

function renderResultCount(count) {
  const total = state.data.articles.length;
  els.resultCount.textContent = `${count} of ${total} FAQs`;
}

function renderCategoryTree(counts) {
  const rows = [];

  rows.push(`
    <button
      class="category-row ${state.selectedTopicId === "__all__" ? "selected" : ""}"
      type="button"
      data-topic-id="__all__"
      data-depth="0"
      role="treeitem"
      aria-level="1"
      aria-selected="${state.selectedTopicId === "__all__"}"
      tabindex="${state.activeTreeItemId === "__all__" ? "0" : "-1"}"
    >
      <span>All topics</span>
      <span class="category-count">${state.data.articles.length}</span>
    </button>
  `);

  for (const topic of state.allTopics) {
    const count = counts.get(topic.id) || 0;
    const isSelected = state.selectedTopicId === topic.id;
    const indent = topic.depth * TREE_DEPTH_INDENT_PX;

    rows.push(`
      <button
        class="category-row ${isSelected ? "selected" : ""}"
        type="button"
        style="padding-left:${TREE_BASE_INDENT_PX + indent}px"
        data-topic-id="${topic.id}"
        data-depth="${topic.depth}"
        role="treeitem"
        aria-level="${topic.depth + 1}"
        aria-selected="${isSelected}"
        tabindex="${state.activeTreeItemId === topic.id ? "0" : "-1"}"
      >
        <span>${escapeHtml(topic.label)}</span>
        <span class="category-count">${count}</span>
      </button>
    `);
  }

  els.categoryTree.innerHTML = rows.join("");

  for (const button of els.categoryTree.querySelectorAll(".category-row")) {
    button.addEventListener("click", () => {
      const topicId = button.dataset.topicId || "__all__";
      selectTopic(topicId, false);
    });
  }
}

function handleCategoryTreeKeydown(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !target.classList.contains("category-row")) return;

  const buttons = getTreeButtons();
  if (!buttons.length) return;

  const currentIndex = buttons.indexOf(target);
  if (currentIndex < 0) return;

  const key = event.key;

  if (key === "ArrowDown") {
    event.preventDefault();
    focusTreeButtonByIndex(buttons, Math.min(currentIndex + 1, buttons.length - 1));
    return;
  }

  if (key === "ArrowUp") {
    event.preventDefault();
    focusTreeButtonByIndex(buttons, Math.max(currentIndex - 1, 0));
    return;
  }

  if (key === "Home") {
    event.preventDefault();
    focusTreeButtonByIndex(buttons, 0);
    return;
  }

  if (key === "End") {
    event.preventDefault();
    focusTreeButtonByIndex(buttons, buttons.length - 1);
    return;
  }

  if (key === "ArrowRight") {
    event.preventDefault();
    const childIndex = firstChildIndex(buttons, currentIndex);
    if (childIndex !== -1) {
      focusTreeButtonByIndex(buttons, childIndex);
    }
    return;
  }

  if (key === "ArrowLeft") {
    event.preventDefault();
    const parentIndex = parentIndexOf(buttons, currentIndex);
    if (parentIndex !== -1) {
      focusTreeButtonByIndex(buttons, parentIndex);
    }
    return;
  }

  if (key === "Enter" || key === " ") {
    event.preventDefault();
    selectTopic(target.dataset.topicId || "__all__", true);
  }
}

function selectTopic(topicId, restoreFocus) {
  state.selectedTopicId = topicId;
  state.activeTreeItemId = topicId;
  render();

  if (!restoreFocus) return;
  const next = els.categoryTree.querySelector(`.category-row[data-topic-id="${cssEscape(topicId)}"]`);
  if (next instanceof HTMLElement) {
    next.focus();
  }
}

function getTreeButtons() {
  return Array.from(els.categoryTree.querySelectorAll(".category-row"));
}

function focusTreeButtonByIndex(buttons, index) {
  const button = buttons[index];
  if (!button) return;
  state.activeTreeItemId = button.dataset.topicId || "__all__";
  for (const candidate of buttons) {
    candidate.tabIndex = candidate === button ? 0 : -1;
  }
  button.focus();
}

function firstChildIndex(buttons, currentIndex) {
  const currentDepth = Number(buttons[currentIndex].dataset.depth || "0");
  for (let i = currentIndex + 1; i < buttons.length; i += 1) {
    const depth = Number(buttons[i].dataset.depth || "0");
    if (depth === currentDepth + 1) return i;
    if (depth <= currentDepth) return -1;
  }
  return -1;
}

function parentIndexOf(buttons, currentIndex) {
  const currentDepth = Number(buttons[currentIndex].dataset.depth || "0");
  if (currentDepth === 0) return -1;
  for (let i = currentIndex - 1; i >= 0; i -= 1) {
    const depth = Number(buttons[i].dataset.depth || "0");
    if (depth === currentDepth - 1) return i;
  }
  return -1;
}

function cssEscape(value) {
  if (window.CSS && typeof window.CSS.escape === "function") {
    return window.CSS.escape(value);
  }
  return String(value).replace(/["\\]/g, "\\$&");
}

function renderFaqList(articles) {
  if (!articles.length) {
    state.activeFaqItemId = null;
    els.faqList.innerHTML = `
      <div class="empty-state">
        <p><strong>No matching FAQs.</strong></p>
        <p>Try a different keyword or choose a different topic.</p>
      </div>
    `;
    return;
  }

  const listItems = articles
    .map((article) => {
      const safeId = `faq-${article.urlName}`;

      return `
        <li class="faq-list-item">
          <article class="faq-item" id="${safeId}">
            <details>
              <summary>
                <div class="faq-head">
                  <h3>${escapeHtml(stripQuestionPrefix(article.question))}</h3>
                </div>
              </summary>
              <div class="answer">${semanticizeAnswerHtml(article.answerHtml)}</div>
            </details>
            <button
              class="copy-link-btn"
              type="button"
              data-link="#${safeId}"
              aria-label="Copy link to: ${escapeHtml(stripQuestionPrefix(article.question))}"
            >
              Copy link
            </button>
          </article>
        </li>
      `;
    })
    .join("");

  els.faqList.innerHTML = `<ul class="faq-list-items" role="list">${listItems}</ul>`;

  for (const link of els.faqList.querySelectorAll(".answer a[target='_blank']")) {
    if (!link.getAttribute("rel")) {
      link.setAttribute("rel", "noopener noreferrer");
    }
  }

  for (const button of els.faqList.querySelectorAll(".copy-link-btn")) {
    button.addEventListener("click", async () => {
      const hash = button.dataset.link;
      if (!hash) return;

      const url = new URL(hash, window.location.href).href;
      const copied = await copyToClipboard(url);

      if (copied) {
        button.textContent = "Copied";
        button.setAttribute("aria-label", "Link copied to clipboard");
        setTimeout(() => {
          button.textContent = "Copy link";
          const article = button.closest(".faq-item");
          const question = article?.querySelector("h3")?.textContent?.trim();
          button.setAttribute("aria-label", question ? `Copy link to: ${question}` : "Copy link to this question");
        }, 1300);
      }
    });
  }

  setupFaqKeyboardNavigation();
  openByHash();
}

function getFaqSummaries() {
  return Array.from(els.faqList.querySelectorAll(".faq-item summary"));
}

function setActiveFaqSummary(summary, focus = false) {
  const summaries = getFaqSummaries();
  if (!summary || !summaries.includes(summary)) return;

  for (const candidate of summaries) {
    candidate.tabIndex = candidate === summary ? 0 : -1;
  }

  const item = summary.closest(".faq-item");
  state.activeFaqItemId = item?.id || null;

  if (focus) {
    summary.focus();
  }
}

function setupFaqKeyboardNavigation() {
  const summaries = getFaqSummaries();
  if (!summaries.length) return;

  let preferred = null;

  if (state.activeFaqItemId) {
    preferred = els.faqList.querySelector(`#${cssEscape(state.activeFaqItemId)} summary`);
  }

  if (!preferred && location.hash) {
    preferred = els.faqList.querySelector(`${location.hash} summary`);
  }

  setActiveFaqSummary(preferred || summaries[0], false);
}

function handleFaqListFocusIn(event) {
  const summary = event.target instanceof HTMLElement ? event.target.closest(".faq-item summary") : null;
  if (summary instanceof HTMLElement) {
    setActiveFaqSummary(summary, false);
  }
}

function handleFaqListClick(event) {
  const summary = event.target instanceof HTMLElement ? event.target.closest(".faq-item summary") : null;
  if (summary instanceof HTMLElement) {
    setActiveFaqSummary(summary, false);
  }
}

function handleFaqListKeydown(event) {
  const summary = event.target instanceof HTMLElement ? event.target.closest(".faq-item summary") : null;
  if (!summary) return;

  const summaries = getFaqSummaries();
  if (!summaries.length) return;

  const currentIndex = summaries.indexOf(summary);
  if (currentIndex < 0) return;

  if (event.key === "ArrowDown") {
    event.preventDefault();
    setActiveFaqSummary(summaries[Math.min(currentIndex + 1, summaries.length - 1)], true);
    return;
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    setActiveFaqSummary(summaries[Math.max(currentIndex - 1, 0)], true);
    return;
  }

  if (event.key === "Home") {
    event.preventDefault();
    setActiveFaqSummary(summaries[0], true);
    return;
  }

  if (event.key === "End") {
    event.preventDefault();
    setActiveFaqSummary(summaries[summaries.length - 1], true);
    return;
  }

  if (event.key === " " || event.key === "Enter") {
    event.preventDefault();
    const details = summary.parentElement;
    if (details instanceof HTMLDetailsElement) {
      details.open = !details.open;
    }
  }
}

async function copyToClipboard(value) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch (error) {
    // Fall through to legacy approach.
  }

  try {
    const tempInput = document.createElement("input");
    tempInput.value = value;
    tempInput.setAttribute("readonly", "");
    tempInput.style.position = "absolute";
    tempInput.style.left = "-9999px";
    document.body.appendChild(tempInput);
    tempInput.select();
    const ok = document.execCommand("copy");
    tempInput.remove();
    return ok;
  } catch (error) {
    console.error("Unable to copy link:", error);
    return false;
  }
}

function openByHash() {
  if (!location.hash) return;
  const target = document.querySelector(location.hash);
  if (!target) return;

  const details = target.querySelector("details");
  if (details) details.open = true;
  const summary = target.querySelector("summary");
  if (summary instanceof HTMLElement) {
    setActiveFaqSummary(summary, false);
  }

  // Ensure deep-linked FAQs are brought into view after expansion.
  requestAnimationFrame(() => {
    target.scrollIntoView({ block: "start", behavior: "auto" });
  });
}
