const DRAFT_STORAGE_KEY = "fdicSupportIntakeDraft";
const SUBMITTED_STORAGE_KEY = "fdicSupportSubmittedCase";
const CASE_HISTORY_STORAGE_KEY = "fdicSupportCaseHistory";

const search = new URLSearchParams(window.location.search);
const mode = search.get("mode") || "report";
// Depends on components.js loading first on this page.
const routes = window.ROUTES;

const summary = document.getElementById("review-summary");
const missing = document.getElementById("review-missing");
const backLink = document.getElementById("review-back");
const submitButton = document.getElementById("submit-request");
const submitStatus = document.getElementById("submit-status");
const reviewMain = document.querySelector(".review-main");

const intentNode = document.getElementById("review-intent");
const topicNode = document.getElementById("review-topic");
const detailsNode = document.getElementById("review-details");
const outcomeNode = document.getElementById("review-outcome");
const nameNode = document.getElementById("review-name");
const emailNode = document.getElementById("review-email");
const phoneNode = document.getElementById("review-phone");
const addressNode = document.getElementById("review-address");
const resolutionNode = document.getElementById("review-resolution");
const endpointNode = document.getElementById("review-endpoint");
const faqSuggestions = document.getElementById("faq-suggestions");
const faqSuggestionsList = document.getElementById("faq-suggestions-list");
const FAQ_DATA_PATH = "data.json";
const SUBMIT_BUTTON_DEFAULT_LABEL = submitButton?.textContent?.trim() || "Submit request";
let isSubmitting = false;
let faqSuggestionsController = null;

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
  process_help: [
    "FDIC services",
    "banking guidance",
  ],
  dir: [
    "bank data",
    "DIR",
    "QBP",
    "Call Report",
  ],
  qbp_analysis: [
    "Quarterly Banking Profile",
    "QBP",
    "industry analysis",
  ],
  call_report_data: [
    "Call Report",
    "reporting data",
    "series definitions",
  ],
  bank_history_records: [
    "bank history",
    "BankFind",
    "failed bank records",
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

const FAQ_TOPIC_CONTEXT = {
  report: ["Information About My Bank", "Bank Regulations"],
  bank_issue: ["Information About My Bank", "Bank Regulations"],
  fdic_issue: ["About FDIC"],
  appraisal: ["Mortgages", "More About Loans"],
  ask: ["About FDIC", "Bank Regulations"],
  deposit_question: ["Understanding Deposit Insurance", "What's Covered?", "Is My Bank Insured?", "Are My Accounts Insured?"],
  general_question: ["Bank Regulations", "About FDIC"],
  process_help: ["About FDIC", "Bank Regulations"],
  dir: ["Industry Information and Data Tools"],
  qbp_analysis: ["Industry Information and Data Tools"],
  call_report_data: ["Industry Information and Data Tools"],
  bank_history_records: ["Industry Information and Data Tools", "Information About My Bank", "Bank Failures"],
  failed: ["When a Bank Fails", "Bank Failures"],
  depositor_claim: ["When a Bank Fails", "Bank Failures"],
  lien_release: ["Lien Releases from Failed Banks", "Institution & Asset Sales"],
  insured_status: ["Is My Bank Insured?", "Understanding Deposit Insurance"],
};

function getContextTopicLabels(draft) {
  return [...new Set([
    ...(FAQ_TOPIC_CONTEXT[draft.intent] || []),
    ...(FAQ_TOPIC_CONTEXT[draft.topic] || []),
  ])];
}

function hasContextTopicMatch(article, contextLabels) {
  if (!contextLabels.length) {
    return false;
  }
  const articleLabels = Array.isArray(article?.topics)
    ? article.topics.map((topic) => (topic?.label || "").trim().toLowerCase()).filter(Boolean)
    : [];
  if (!articleLabels.length) {
    return false;
  }
  const contextLabelSet = new Set(contextLabels.map((label) => label.toLowerCase()));
  return articleLabels.some((label) => contextLabelSet.has(label));
}

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
  nameNode.textContent = formatName(draft);
  emailNode.textContent = draft.email || "Not provided";
  phoneNode.textContent = draft.businessPhone || "Not provided";
  addressNode.textContent = formatAddress(draft);
  resolutionNode.textContent = draft.desiredResolution || "Not provided";
  endpointNode.textContent = draft.endpointLabel || "Not provided";
  renderFaqSuggestions(draft);

  summary.hidden = false;
  missing.hidden = true;
}

function renderFaqSuggestions(draft) {
  if (!faqSuggestions || !faqSuggestionsList) {
    return;
  }
  if (faqSuggestionsController) {
    faqSuggestionsController.abort();
  }
  faqSuggestionsController = new AbortController();
  faqSuggestionsList.innerHTML = '<li><span>Loading related FAQs...</span></li>';
  faqSuggestions.hidden = false;

  fetch(FAQ_DATA_PATH, { signal: faqSuggestionsController.signal })
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
          const href = `${routes.faq}#${hash}`;
          const label = window.escapeHtml(window.stripQuestionPrefix(article.question || "Untitled FAQ"));
          return `<li><a href="${href}">${label}</a></li>`;
        })
        .join("");
    })
    .catch((err) => {
      if (err?.name === "AbortError") return;
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
    .map((query) => `<li><a href="${routes.faq}?q=${encodeURIComponent(query)}">${window.escapeHtml(query)}</a></li>`)
    .join("");
}

function getFaqSuggestions(articles, draft, limit = 3) {
  const contextLabels = getContextTopicLabels(draft);
  const narrowed = contextLabels.length
    ? articles.filter((article) => hasContextTopicMatch(article, contextLabels))
    : [];
  const candidatePool = narrowed.length >= limit ? narrowed : articles;

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

  const ranked = candidatePool
    .map((article) => {
      const question = (article.question || "").toLowerCase();
      const summary = (article.summary || "").toLowerCase();
      const topicText = Array.isArray(article.topics)
        ? article.topics.map((topic) => (topic?.label || "").toLowerCase()).join(" ")
        : "";
      let score = 0;
      const contextMatch = hasContextTopicMatch(article, contextLabels);

      if (contextMatch) score += 15;

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

function renderMissingState() {
  summary.hidden = true;
  missing.hidden = false;
  submitButton.disabled = true;
  submitButton.setAttribute("aria-disabled", "true");
}

function setSubmitting(submitting) {
  isSubmitting = submitting;
  submitButton.disabled = submitting;
  submitButton.setAttribute("aria-disabled", submitting ? "true" : "false");
  submitButton.classList.toggle("is-loading", submitting);
  submitButton.textContent = submitting ? "Submitting..." : SUBMIT_BUTTON_DEFAULT_LABEL;
  if (reviewMain) {
    reviewMain.setAttribute("aria-busy", submitting ? "true" : "false");
  }
}

function formatName(draft) {
  const first = (draft.firstName || "").trim();
  const last = (draft.lastName || "").trim();
  return [first, last].filter(Boolean).join(" ") || "Not provided";
}

function formatAddress(draft) {
  const parts = [
    draft.mailingStreet,
    [draft.mailingCity, draft.mailingState].filter(Boolean).join(", "),
    draft.mailingPostal,
    draft.mailingCountry,
  ]
    .map((part) => (part || "").trim())
    .filter(Boolean);
  return parts.join(" • ") || "Not provided";
}

function updateBreadcrumb(draft) {
  const breadcrumb = document.querySelector("fdic-breadcrumb");
  if (!breadcrumb || !draft?.workflowHeading) {
    return;
  }
  const crumbs = [
    { label: "Home", href: "https://www.fdic.gov" },
    { label: "Information and Support Center", href: "index.html" },
    { label: draft.workflowHeading, href: "report-problem.html" },
    { label: "Review Submission" },
  ];
  breadcrumb.setAttribute("crumbs", JSON.stringify(crumbs));
}

backLink.setAttribute("href", routes.reportMode(mode));

const draft = loadDraft();
if (
  !draft ||
  !draft.intent ||
  !draft.topic ||
  !draft.details ||
  !draft.outcome ||
  !draft.firstName ||
  !draft.lastName ||
  !draft.email ||
  !draft.mailingStreet ||
  !draft.mailingCity ||
  !draft.mailingState ||
  !draft.mailingPostal ||
  !draft.mailingCountry ||
  !draft.desiredResolution
) {
  renderMissingState();
} else {
  updateBreadcrumb(draft);
  renderDraft(draft);
}

submitButton.addEventListener("click", () => {
  if (isSubmitting) {
    return;
  }

  const latestDraft = loadDraft();
  if (!latestDraft) {
    submitStatus.textContent = "No complete draft found. Return to the form and try again.";
    return;
  }

  setSubmitting(true);
  submitStatus.textContent = "Submitting your request...";

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
  try {
    window.setTimeout(() => {
      window.location.href = `${routes.submissionConfirmation}?mode=${encodeURIComponent(mode)}`;
    }, 150);
  } catch {
    setSubmitting(false);
    submitStatus.textContent = "We could not submit your request. Please try again.";
  }
});

window.addEventListener("pagehide", () => {
  if (faqSuggestionsController) {
    faqSuggestionsController.abort();
    faqSuggestionsController = null;
  }
});
