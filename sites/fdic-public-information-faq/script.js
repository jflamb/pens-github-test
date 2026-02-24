const state = {
  data: null,
  query: "",
  selectedTopicId: "__all__",
  allTopics: [],
  searchDebounceId: null,
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

    wireEvents();
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
    }, 200);
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
    if (fields.question.includes(token)) score += 7;
    if (fields.topicText.includes(token)) score += 5;
    if (fields.summary.includes(token)) score += 3;
    if (fields.answer.includes(token)) score += 1;
  }

  if (normalizedQuery && fields.question.includes(normalizedQuery)) score += 12;
  if (normalizedQuery && fields.topicText.includes(normalizedQuery)) score += 8;

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
    <button class="category-row ${state.selectedTopicId === "__all__" ? "selected" : ""}" type="button" data-topic-id="__all__" role="treeitem" aria-selected="${state.selectedTopicId === "__all__"}">
      <span>All topics</span>
      <span class="category-count">${state.data.articles.length}</span>
    </button>
  `);

  for (const topic of state.allTopics) {
    const count = counts.get(topic.id) || 0;
    const isSelected = state.selectedTopicId === topic.id;
    const indent = topic.depth * 16;

    rows.push(`
      <button
        class="category-row ${isSelected ? "selected" : ""}"
        type="button"
        style="padding-left:${16 + indent}px"
        data-topic-id="${topic.id}"
        role="treeitem"
        aria-selected="${isSelected}"
      >
        <span>${escapeHtml(topic.label)}</span>
        <span class="category-count">${count}</span>
      </button>
    `);
  }

  els.categoryTree.innerHTML = rows.join("");

  for (const button of els.categoryTree.querySelectorAll(".category-row")) {
    button.addEventListener("click", () => {
      state.selectedTopicId = button.dataset.topicId || "__all__";
      render();
    });
  }
}

function renderFaqList(articles) {
  if (!articles.length) {
    els.faqList.innerHTML = `
      <div class="empty-state">
        <p><strong>No matching FAQs.</strong></p>
        <p>Try a different keyword or choose a different topic.</p>
      </div>
    `;
    return;
  }

  els.faqList.innerHTML = articles
    .map((article) => {
      const safeId = `faq-${article.urlName}`;
      const topicTags = article.topics
        .map((topic) => `<span class="topic-tag">${escapeHtml(topic.label)}</span>`)
        .join("");

      return `
        <article class="faq-item" id="${safeId}">
          <details>
            <summary>
              <div class="faq-head">
                <h3>${escapeHtml(article.question)}</h3>
                <a class="deep-link" href="#${safeId}" aria-label="Direct link to this question">Link</a>
              </div>
              <div class="topic-tags">${topicTags}</div>
            </summary>
            <div class="answer">${semanticizeAnswerHtml(article.answerHtml)}</div>
          </details>
        </article>
      `;
    })
    .join("");

  for (const link of els.faqList.querySelectorAll(".answer a[target='_blank']")) {
    if (!link.getAttribute("rel")) {
      link.setAttribute("rel", "noopener noreferrer");
    }
  }

  openByHash();
}

function openByHash() {
  if (!location.hash) return;
  const target = document.querySelector(location.hash);
  if (!target) return;

  const details = target.querySelector("details");
  if (details) details.open = true;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
