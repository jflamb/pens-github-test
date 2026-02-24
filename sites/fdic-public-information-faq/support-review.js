const DRAFT_STORAGE_KEY = "fdicSupportIntakeDraft";
const SUBMITTED_STORAGE_KEY = "fdicSupportSubmittedCase";
const CASE_HISTORY_STORAGE_KEY = "fdicSupportCaseHistory";

const search = new URLSearchParams(window.location.search);
const mode = search.get("mode") || "report";

const summary = document.getElementById("review-summary");
const missing = document.getElementById("review-missing");
const backLink = document.getElementById("review-back");
const submitButton = document.getElementById("submit-request");
const submitStatus = document.getElementById("submit-status");

const intentNode = document.getElementById("review-intent");
const topicNode = document.getElementById("review-topic");
const detailsNode = document.getElementById("review-details");
const outcomeNode = document.getElementById("review-outcome");
const stateNode = document.getElementById("review-state");
const contactNode = document.getElementById("review-contact");
const endpointNode = document.getElementById("review-endpoint");
const faqSuggestions = document.getElementById("faq-suggestions");
const faqSuggestionsList = document.getElementById("faq-suggestions-list");
const FAQ_DATA_PATH = "data.json";

const FAQ_HINTS = {
  bank_issue: [
    "bank fee",
    "open bank account fees",
    "banking services",
  ],
  fdic_issue: [
    "contact FDIC",
    "file complaint",
    "FDIC services",
  ],
  appraisal: [
    "appraisal",
    "real estate transaction",
  ],
  deposit_question: [
    "deposit insurance",
    "accounts insured",
    "is my bank insured",
  ],
  bank_data: [
    "bank data",
    "bank history",
    "bank fails",
  ],
  general_question: [
    "regulatory question",
    "banking guidance",
  ],
  depositor_claim: [
    "bank failures",
    "deposit claims",
    "unclaimed dividends",
  ],
  lien_release: [
    "lien release",
    "failed bank records",
  ],
  insured_status: [
    "FDIC insured",
    "deposit insurance",
  ],
};

function loadDraft() {
  try {
    const raw = sessionStorage.getItem(DRAFT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function renderDraft(draft) {
  intentNode.textContent = draft.workflowHeading || "Not provided";
  topicNode.textContent = draft.topicTitle || "Not provided";
  detailsNode.textContent = draft.details || "Not provided";
  outcomeNode.textContent = draft.outcomeTitle || "Not provided";
  stateNode.textContent = draft.residentState || "Not provided";
  contactNode.textContent = formatContact(draft);
  endpointNode.textContent = draft.endpointLabel
    ? `${draft.endpointLabel}${draft.queueCode ? ` (${draft.queueCode})` : ""}`
    : "Not provided";
  renderFaqSuggestions(draft);

  summary.hidden = false;
  missing.hidden = true;
}

function renderFaqSuggestions(draft) {
  if (!faqSuggestions || !faqSuggestionsList) {
    return;
  }
  faqSuggestionsList.innerHTML = '<li><span>Loading related FAQs...</span></li>';
  faqSuggestions.hidden = false;

  fetch(FAQ_DATA_PATH)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Unable to load FAQ data.");
      }
      return response.json();
    })
    .then((data) => {
      const articles = Array.isArray(data?.articles) ? data.articles : [];
      const matches = getFaqSuggestions(articles, draft, 3);

      if (!matches.length) {
        renderFallbackTopicHints(draft);
        return;
      }

      faqSuggestionsList.innerHTML = matches
        .map((article) => {
          const hash = `faq-${article.urlName || article.id}`;
          const href = `faq.html#${hash}`;
          const label = escapeHtml(stripQuestionPrefix(article.question || "Untitled FAQ"));
          return `<li><a href="${href}">${label}</a></li>`;
        })
        .join("");
    })
    .catch(() => {
      renderFallbackTopicHints(draft);
    });
}

function renderFallbackTopicHints(draft) {
  const suggestions = FAQ_HINTS[draft.topic] || FAQ_HINTS[draft.intent] || [];
  if (!suggestions.length) {
    faqSuggestions.hidden = true;
    faqSuggestionsList.innerHTML = "";
    return;
  }

  faqSuggestionsList.innerHTML = suggestions
    .slice(0, 3)
    .map((query) => `<li><a href="faq.html?q=${encodeURIComponent(query)}">${escapeHtml(query)}</a></li>`)
    .join("");
}

function getFaqSuggestions(articles, draft, limit = 3) {
  const keywords = [
    ...(FAQ_HINTS[draft.topic] || []),
    ...(FAQ_HINTS[draft.intent] || []),
    draft.topicTitle || "",
    draft.outcomeTitle || "",
    draft.workflowHeading || "",
  ]
    .join(" ")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

  if (!keywords.length) {
    return [];
  }

  const ranked = articles
    .map((article) => {
      const question = (article.question || "").toLowerCase();
      const summary = (article.summary || "").toLowerCase();
      const topicText = Array.isArray(article.topics)
        ? article.topics.map((topic) => (topic?.label || "").toLowerCase()).join(" ")
        : "";
      const haystack = `${question} ${summary} ${topicText}`;
      let score = 0;

      for (const term of keywords) {
        if (question.includes(term)) score += 6;
        if (topicText.includes(term)) score += 5;
        if (summary.includes(term)) score += 2;
      }

      return { article, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  const deduped = [];
  const seen = new Set();
  for (const entry of ranked) {
    const key = entry.article?.urlName || entry.article?.id;
    if (!key || seen.has(key)) continue;
    deduped.push(entry.article);
    seen.add(key);
    if (deduped.length >= limit) break;
  }

  return deduped;
}

function stripQuestionPrefix(text) {
  return (text || "").replace(/^\s*Q:\s*/i, "").trim();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderMissingState() {
  summary.hidden = true;
  missing.hidden = false;
  submitButton.disabled = true;
}

function formatContact(draft) {
  const value = draft.contactValue || "";
  if (!value) {
    return "Not provided";
  }
  if (draft.contactMethod === "email") {
    return `Email: ${value}`;
  }
  if (draft.contactMethod === "phone") {
    return `Phone: ${value}`;
  }
  return value;
}

backLink.setAttribute("href", `report-problem.html?mode=${encodeURIComponent(mode)}`);

const draft = loadDraft();
if (
  !draft ||
  !draft.intent ||
  !draft.topic ||
  !draft.details ||
  !draft.outcome ||
  !draft.residentState ||
  !draft.contactMethod ||
  !draft.contactValue
) {
  renderMissingState();
} else {
  renderDraft(draft);
}

submitButton.addEventListener("click", () => {
  const latestDraft = loadDraft();
  if (!latestDraft) {
    submitStatus.textContent = "No complete draft found. Return to the form and try again.";
    return;
  }

  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replaceAll("-", "");
  const randPart = Math.floor(1000 + Math.random() * 9000);
  const caseId = `FDIC-${datePart}-${randPart}`;

  const submittedCase = {
    caseId,
    submittedAt: now.toISOString(),
    status: "Submitted",
    ...latestDraft,
  };

  sessionStorage.setItem(SUBMITTED_STORAGE_KEY, JSON.stringify(submittedCase));
  try {
    const existing = JSON.parse(localStorage.getItem(CASE_HISTORY_STORAGE_KEY) || "[]");
    const history = Array.isArray(existing) ? existing : [];
    history.push({
      caseId: submittedCase.caseId,
      submittedAt: submittedCase.submittedAt,
      workflowHeading: submittedCase.workflowHeading,
      topicTitle: submittedCase.topicTitle,
      outcomeTitle: submittedCase.outcomeTitle,
      endpointLabel: submittedCase.endpointLabel,
      queueCode: submittedCase.queueCode,
      status: submittedCase.status,
    });
    localStorage.setItem(CASE_HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch {
    // Ignore localStorage failures in prototype mode.
  }
  window.location.href = `submission-confirmation.html?mode=${encodeURIComponent(mode)}`;
});
