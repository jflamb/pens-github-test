const ENDPOINTS = {
  fdiccaform: {
    label: "Bank and Consumer Response Team",
    queueCode: "Q-BCR",
  },
  fdicdiform: {
    label: "Deposit Insurance Specialist Team",
    queueCode: "Q-DI",
  },
  fdicbaform: {
    label: "Small Business Banking Team",
    queueCode: "Q-SB",
  },
  fdicdirform: {
    label: "Data and Directory Support Team",
    queueCode: "Q-DATA",
  },
  fidciaform: {
    label: "Interagency Appraisal Review Team",
    queueCode: "Q-APR",
  },
  fdicdimcomplaintform: {
    label: "Insured Status Review Team",
    queueCode: "Q-ISR",
  },
  fdicLienRelease: {
    label: "Lien and Loan Documents Team",
    queueCode: "Q-LIEN",
  },
  requestformDepositor: {
    label: "Failed Bank Depositor Services Team",
    queueCode: "Q-DEP",
  },
};

const DRAFT_STORAGE_KEY = "fdicSupportIntakeDraft";
const FAQ_DATA_PATH = "data.json";

const OUTCOME_OPTIONS = [
  { value: "info", title: "Information or clarification" },
  { value: "review", title: "Review a concern or complaint" },
  { value: "resolution", title: "Help resolve an issue" },
  { value: "other", title: "Other or not sure" },
];

const US_STATES_AND_TERRITORIES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Puerto Rico", "Rhode Island", "South Carolina", "South Dakota", "Tennessee",
  "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
  "American Samoa", "Guam", "Northern Mariana Islands", "U.S. Virgin Islands",
];

const WORKFLOWS = {
  report: {
    heading: "Report a problem or concern",
    subcopy: "Use this when you believe a bank or the FDIC handled something incorrectly.",
    topicLegend: "What is your concern related to?",
    topics: [
      {
        value: "bank_issue",
        title: "A bank or financial institution",
        detail: "For service issues, unfair treatment, or potential policy violations.",
        endpointKey: "fdiccaform",
      },
      {
        value: "fdic_issue",
        title: "The FDIC",
        detail: "For concerns about FDIC actions, communication, or process.",
        endpointKey: "fdiccaform",
      },
      {
        value: "appraisal",
        title: "An appraisal-related issue",
        detail: "For appraisal concerns tied to a bank or real estate transaction.",
        endpointKey: "fidciaform",
      },
    ],
    detailsLegend: "Briefly describe the problem",
  },
  ask: {
    heading: "Ask a question or get guidance",
    subcopy: "Use this when you need information or are not sure which process applies.",
    topicLegend: "What do you need help with?",
    topics: [
      {
        value: "deposit_question",
        title: "Deposit insurance coverage",
        detail: "Coverage rules, account ownership categories, and limits.",
        endpointKey: "fdicdiform",
      },
      {
        value: "general_question",
        title: "General regulatory question",
        detail: "A broad question about FDIC-supervised banking topics.",
        endpointKey: "fdiccaform",
      },
      {
        value: "process_help",
        title: "Not sure which option applies",
        detail: "Guidance when your request does not fit a clear category.",
        endpointKey: "fdiccaform",
      },
    ],
    detailsLegend: "What question do you need answered?",
  },
  dir: {
    heading: "Request FDIC Bank Data and Research information",
    subcopy: "Use this for DIR-directed requests such as QBP, Call Reports, and industry analysis.",
    topicLegend: "What data or research do you need?",
    topics: [
      {
        value: "qbp_analysis",
        title: "Quarterly Banking Profile (QBP) or industry analysis",
        detail: "Questions on QBP trends, tables, and related analysis.",
        endpointKey: "fdicdirform",
      },
      {
        value: "call_report_data",
        title: "Call Report data",
        detail: "Requests involving Call Report definitions, series, or extracts.",
        endpointKey: "fdicdirform",
      },
      {
        value: "bank_history_records",
        title: "Bank history, BankFind, or failed-bank records",
        detail: "Historical institution data, location history, and failed-bank information.",
        endpointKey: "fdicdirform",
      },
    ],
    detailsLegend: "Describe the DIR information you need",
  },
  failed: {
    heading: "Get help with a failed bank",
    subcopy: "Use this when your issue involves a closed or failed institution.",
    topicLegend: "Which failed-bank topic is closest to your request?",
    topics: [
      {
        value: "depositor_claim",
        title: "Depositor claims and account records",
        detail: "Address changes, claim status, statements, and related records.",
        endpointKey: "requestformDepositor",
      },
      {
        value: "lien_release",
        title: "Lien release or collateral documentation",
        detail: "Lien release, assignment, allonge, or related loan records.",
        endpointKey: "fdicLienRelease",
      },
      {
        value: "insured_status",
        title: "Whether an entity or product is FDIC-insured",
        detail: "Concerns about insured status claims or advertising language.",
        endpointKey: "fdicdimcomplaintform",
      },
    ],
    detailsLegend: "Describe what you need from the failed-bank process",
  },
};

class FDICChoiceGroup extends HTMLElement {
  setConfig(config, selectedValue = "") {
    this.config = config;
    this.selectedValue = selectedValue;
    this.render();
  }

  connectedCallback() {
    this.addEventListener("change", (event) => {
      if (!(event.target instanceof HTMLInputElement)) {
        return;
      }
      this.querySelectorAll(".report-option").forEach((node) => {
        node.classList.remove("is-selected");
      });
      const selectedLabel = event.target.closest("label.report-option");
      if (selectedLabel) {
        selectedLabel.classList.add("is-selected");
      }
      this.dispatchEvent(
        new CustomEvent("choicechange", {
          bubbles: true,
          detail: {
            name: this.config?.name,
            value: event.target.value,
          },
        }),
      );
    });

    if (this.config) {
      this.render();
    }
  }

  render() {
    if (!this.config) {
      return;
    }

    const legendRequired = this.config.required ? ' <span class="report-required-marker" aria-hidden="true">*</span>' : "";

    const radios = this.config.options
      .map((option, index) => {
        const checked = option.value === this.selectedValue;
        const id = `${this.config.name}-${index}`;
        const selectedClass = checked ? " is-selected" : "";
        const safeTitle = escapeHtml(option.title || "");
        const safeDetail = option.detail ? escapeHtml(option.detail) : "";
        const detail = safeDetail ? `<span class="report-option-detail">${safeDetail}</span>` : "";

        return `<label class="report-option${selectedClass}" for="${id}">
            <input id="${id}" type="radio" name="${this.config.name}" value="${option.value}" ${checked ? "checked" : ""} ${this.config.required ? 'aria-required="true"' : ""} />
            <span class="report-option__text">
              <strong>${safeTitle}</strong>
              ${detail}
            </span>
          </label>`;
      })
      .join("");

    this.innerHTML = `<fieldset class="report-fieldset" data-group-name="${this.config.name}">
        <legend id="${this.config.name}-legend">${this.config.legend}${legendRequired}</legend>
        ${this.config.help ? `<p class="report-subcopy">${this.config.help}</p>` : ""}
        <div class="report-grid">${radios}</div>
      </fieldset>`;
    this.setAttribute("aria-required", this.config.required ? "true" : "false");
  }
}

customElements.define("fdic-choice-group", FDICChoiceGroup);

const modeParam = new URLSearchParams(window.location.search).get("mode");
const initialMode = modeParam && WORKFLOWS[modeParam] ? modeParam : "";

const state = {
  intent: initialMode,
  topic: "",
  details: "",
  outcome: "",
  firstName: "",
  lastName: "",
  email: "",
  emailConfirm: "",
  businessPhone: "",
  mailingStreet: "",
  mailingCity: "",
  mailingState: "",
  mailingPostal: "",
  mailingCountry: "United States",
  desiredResolution: "",
};

const heading = document.getElementById("intake-heading");
const subcopy = document.getElementById("intake-subcopy");
const defaultHeading = heading?.textContent || "What do you need help with?";
const defaultSubcopy = subcopy?.textContent || "We’ll ask only the questions needed to route your request.";
const intentGroup = document.getElementById("intent-group");
const topicGroup = document.getElementById("topic-group");
const outcomeGroup = document.getElementById("outcome-group");
const topicWrapper = document.getElementById("topic-wrapper");
const detailsWrapper = document.getElementById("details-wrapper");
const outcomeWrapper = document.getElementById("outcome-wrapper");
const identityWrapper = document.getElementById("identity-wrapper");
const mailingWrapper = document.getElementById("mailing-wrapper");
const resolutionWrapper = document.getElementById("resolution-wrapper");
const endpointWrapper = document.getElementById("endpoint-wrapper");
const endpointCopy = document.getElementById("endpoint-copy");
const endpointLinkWrap = document.getElementById("endpoint-link-wrap");
const detailsLegend = document.getElementById("details-legend");
const detailsInput = document.getElementById("details-input");
const firstNameInput = document.getElementById("first-name-input");
const lastNameInput = document.getElementById("last-name-input");
const emailInput = document.getElementById("email-input");
const emailConfirmInput = document.getElementById("email-confirm-input");
const businessPhoneInput = document.getElementById("business-phone-input");
const businessPhoneRequiredMarker = document.getElementById("business-phone-required-marker");
const mailingStreetInput = document.getElementById("mailing-street-input");
const mailingCityInput = document.getElementById("mailing-city-input");
const mailingStateInput = document.getElementById("mailing-state-input");
const mailingPostalInput = document.getElementById("mailing-postal-input");
const mailingCountryInput = document.getElementById("mailing-country-input");
const resolutionInput = document.getElementById("resolution-input");
const contextualFaqWrapper = document.getElementById("contextual-faq-wrapper");
const contextualFaqList = document.getElementById("contextual-faq-list");
const form = document.getElementById("support-intake-form");
const reviewSubmissionButton = document.getElementById("review-submission-btn");
const reviewSubmitHelper = document.getElementById("review-submit-helper");
const submissionDisclosure = document.getElementById("submission-disclosure");
const errorSummary = document.getElementById("form-errors");
const liveStatus = document.getElementById("intake-status");
const summary = document.getElementById("flow-summary");
const summaryCopy = document.getElementById("flow-summary-copy");
const progressTracker = document.querySelector("fdic-progress-tracker");
const progressIntent = document.getElementById("progress-intent");
const progressTopic = document.getElementById("progress-topic");
const progressDetails = document.getElementById("progress-details");
const progressOutcome = document.getElementById("progress-outcome");
const progressIdentity = document.getElementById("progress-identity");
const progressMailing = document.getElementById("progress-mailing");
const progressResolution = document.getElementById("progress-resolution");
let contextualFaqController = null;

function getCurrentWorkflow() {
  return state.intent ? WORKFLOWS[state.intent] || null : null;
}

function isBusinessPhoneRequired() {
  return state.intent === "failed";
}

function isIdentityComplete() {
  return Boolean(
    state.firstName.trim() &&
      state.lastName.trim() &&
      state.email.trim() &&
      state.emailConfirm.trim() &&
      state.email.trim().toLowerCase() === state.emailConfirm.trim().toLowerCase() &&
      (!isBusinessPhoneRequired() || state.businessPhone.trim()),
  );
}

function isMailingComplete() {
  return Boolean(
    state.mailingStreet.trim() &&
      state.mailingCity.trim() &&
      state.mailingState &&
      state.mailingPostal.trim() &&
      state.mailingCountry,
  );
}

function isFormComplete() {
  return Boolean(
    state.intent &&
      state.topic &&
      state.details.trim() &&
      state.outcome &&
      isIdentityComplete() &&
      isMailingComplete() &&
      state.desiredResolution.trim(),
  );
}

function populateStateOptions() {
  if (!mailingStateInput || mailingStateInput.options.length > 1) {
    return;
  }
  const options = US_STATES_AND_TERRITORIES.map((name) => `<option value="${name}">${name}</option>`).join("");
  mailingStateInput.insertAdjacentHTML("beforeend", options);
}

function getContextualFaqTerms() {
  const workflow = getCurrentWorkflow();
  const selectedTopic = workflow?.topics.find((topic) => topic.value === state.topic);
  return [
    state.intent,
    state.topic,
    selectedTopic?.title || "",
    selectedTopic?.detail || "",
    workflow?.heading || "",
  ]
    .join(" ")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function getContextualFaqSuggestions(articles, terms, limit = 3) {
  if (!terms.length) {
    return [];
  }
  const ranked = articles
    .map((article) => {
      const question = (article.question || "").toLowerCase();
      const summary = (article.summary || "").toLowerCase();
      const topicText = Array.isArray(article.topics)
        ? article.topics.map((topic) => (topic?.label || "").toLowerCase()).join(" ")
        : "";
      let score = 0;
      for (const term of terms) {
        if (question.includes(term)) score += 6;
        if (topicText.includes(term)) score += 4;
        if (summary.includes(term)) score += 1;
      }
      return { article, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  const picked = [];
  const seen = new Set();
  for (const entry of ranked) {
    const key = entry.article?.urlName || entry.article?.id;
    if (!key || seen.has(key)) continue;
    picked.push(entry.article);
    seen.add(key);
    if (picked.length >= limit) break;
  }
  return picked;
}

function renderContextualFaqFallback() {
  if (!contextualFaqWrapper || !contextualFaqList) {
    return;
  }
  contextualFaqList.innerHTML = "";
  contextualFaqWrapper.hidden = true;
}

function renderContextualFaqSuggestions() {
  if (!contextualFaqWrapper || !contextualFaqList) {
    return;
  }
  if (!state.topic) {
    renderContextualFaqFallback();
    return;
  }
  if (contextualFaqController) {
    contextualFaqController.abort();
  }
  contextualFaqController = new AbortController();
  contextualFaqWrapper.hidden = false;
  contextualFaqList.innerHTML = "<li><span>Loading related FAQs...</span></li>";

  fetch(FAQ_DATA_PATH, { signal: contextualFaqController.signal })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Unable to load FAQs.");
      }
      return response.json();
    })
    .then((data) => {
      const articles = Array.isArray(data?.articles) ? data.articles : [];
      const suggestions = getContextualFaqSuggestions(articles, getContextualFaqTerms(), 3);
      if (!suggestions.length) {
        renderContextualFaqFallback();
        return;
      }
      contextualFaqList.innerHTML = suggestions
        .map((article) => {
          const hash = `faq-${article.urlName || article.id}`;
          const href = `faq.html#${hash}`;
          const label = escapeHtml(stripQuestionPrefix(article.question || "Untitled FAQ"));
          return `<li><a href="${href}">${label}</a></li>`;
        })
        .join("");
    })
    .catch((error) => {
      if (error?.name === "AbortError") return;
      renderContextualFaqFallback();
    });
}

function renderIntentGroup() {
  intentGroup.setConfig(
    {
      name: "intent",
      legend: "What do you need help with?",
      required: true,
      options: [
        {
          value: "report",
          title: "Report a problem or concern",
          detail: "For complaints or concerns about possible misconduct or unfair treatment.",
        },
        {
          value: "ask",
          title: "Ask a question or get guidance",
          detail: "For help understanding FDIC services, insurance, or requirements.",
        },
        {
          value: "dir",
          title: "Request FDIC Bank Data and Research (DIR) information",
          detail: "For DIR-directed requests, including QBP, Call Reports, and industry analysis.",
        },
        {
          value: "failed",
          title: "Get help with a failed bank",
          detail: "For requests related to a bank closure, claims, records, or lien releases.",
        },
      ],
    },
    state.intent,
  );
}

function renderTopicAndOutcome() {
  const workflow = getCurrentWorkflow();
  if (!workflow) {
    if (progressTracker) {
      progressTracker.hidden = true;
      progressTracker.classList.remove("is-active");
    }
    heading.textContent = defaultHeading;
    subcopy.textContent = defaultSubcopy;
    topicWrapper.hidden = true;
    detailsWrapper.hidden = true;
    outcomeWrapper.hidden = true;
    identityWrapper.hidden = true;
    mailingWrapper.hidden = true;
    resolutionWrapper.hidden = true;
    endpointWrapper.hidden = true;
    renderContextualFaqFallback();
    updateStepState();
    return;
  }

  if (progressTracker) {
    progressTracker.hidden = false;
    progressTracker.classList.add("is-active");
  }
  heading.textContent = workflow.heading;
  subcopy.textContent = workflow.subcopy;
  detailsLegend.innerHTML = `${workflow.detailsLegend} <span class="report-required-marker" aria-hidden="true">*</span>`;

  topicGroup.setConfig(
    {
      name: "topic",
      legend: `${workflow.topicLegend}`,
      required: true,
      options: workflow.topics,
    },
    state.topic,
  );

  outcomeGroup.setConfig(
    {
      name: "outcome",
      legend: "What outcome are you hoping for?",
      required: true,
      options: OUTCOME_OPTIONS,
    },
    state.outcome,
  );

  const showFollowups = Boolean(state.topic);
  topicWrapper.hidden = false;
  detailsWrapper.hidden = !showFollowups;
  outcomeWrapper.hidden = !showFollowups;
  identityWrapper.hidden = !showFollowups;
  mailingWrapper.hidden = !showFollowups;
  resolutionWrapper.hidden = !showFollowups;
  endpointWrapper.hidden = !(state.topic && state.outcome);

  businessPhoneInput.required = isBusinessPhoneRequired();
  businessPhoneInput.setAttribute("aria-required", businessPhoneInput.required ? "true" : "false");
  businessPhoneRequiredMarker.hidden = !businessPhoneInput.required;

  updateEndpoint();
  renderContextualFaqSuggestions();
  updateStepState();
}

function updateEndpoint() {
  const workflow = getCurrentWorkflow();
  const selectedTopic = workflow?.topics.find((topic) => topic.value === state.topic);

  if (!selectedTopic || !state.outcome) {
    endpointWrapper.hidden = true;
    endpointCopy.textContent = "";
    endpointLinkWrap.textContent = "";
    return;
  }

  endpointWrapper.hidden = false;

  const endpoint = ENDPOINTS[selectedTopic.endpointKey];
  if (!endpoint) {
    endpointCopy.textContent = "We will route this to the most appropriate support channel after review.";
    endpointLinkWrap.textContent = "";
    return;
  }

  endpointCopy.textContent = `Based on your selections, your request will be routed to ${endpoint.label} (${endpoint.queueCode}).`;
  endpointLinkWrap.textContent = "";
}

function updateStepState() {
  const workflow = getCurrentWorkflow();
  const selectedTopic = workflow?.topics.find((topic) => topic.value === state.topic);

  const setProgressItem = (node, label, complete, isCurrentStep, targetId, visible) => {
    if (!node) {
      return;
    }
    node.hidden = !visible;
    if (!visible) {
      node.removeAttribute("aria-current");
      node.removeAttribute("aria-label");
      return;
    }
    node.classList.toggle("is-complete", complete);
    node.classList.toggle("is-incomplete", !complete);
    node.removeAttribute("aria-current");
    if (isCurrentStep) {
      node.setAttribute("aria-current", "step");
    }
    node.setAttribute("aria-label", `${label}: ${complete ? "Complete" : "Not started"}`);
    node.innerHTML = `<a class="progress-link" href="#${targetId}"><span class="progress-label">${label}</span></a>`;
  };

  const progressItems = [
    { node: progressIntent, label: "What you need help with", complete: Boolean(state.intent), targetId: "intent-group", visible: true },
    { node: progressTopic, label: "Concern topic", complete: Boolean(selectedTopic), targetId: "topic-wrapper", visible: !topicWrapper.hidden },
    { node: progressDetails, label: "Issue details", complete: Boolean(state.details.trim()), targetId: "details-wrapper", visible: !detailsWrapper.hidden },
    { node: progressOutcome, label: "Desired outcome", complete: Boolean(state.outcome), targetId: "outcome-wrapper", visible: !outcomeWrapper.hidden },
    { node: progressIdentity, label: "Contact information", complete: isIdentityComplete(), targetId: "identity-wrapper", visible: !identityWrapper.hidden },
    { node: progressMailing, label: "Mailing address", complete: isMailingComplete(), targetId: "mailing-wrapper", visible: !mailingWrapper.hidden },
    { node: progressResolution, label: "Desired resolution details", complete: Boolean(state.desiredResolution.trim()), targetId: "resolution-wrapper", visible: !resolutionWrapper.hidden },
  ];
  const visibleItems = progressItems.filter((item) => item.visible);
  const completeCount = visibleItems.filter((item) => item.complete).length;
  const firstIncompleteIndex = visibleItems.findIndex((item) => !item.complete);
  const currentStepNode = firstIncompleteIndex === -1 ? null : visibleItems[firstIncompleteIndex]?.node || null;
  const currentStepId = currentStepNode?.id || "";
  const complete = isFormComplete();

  for (const item of progressItems) {
    setProgressItem(
      item.node,
      item.label,
      item.complete,
      item.node === currentStepNode,
      item.targetId,
      item.visible,
    );
  }

  liveStatus.textContent = `Progress updated. ${completeCount} of ${visibleItems.length} visible required sections complete.`;

  if (submissionDisclosure) {
    submissionDisclosure.hidden = !complete;
  }

  if (reviewSubmissionButton) {
    reviewSubmissionButton.disabled = !complete;
    reviewSubmissionButton.setAttribute("aria-disabled", complete ? "false" : "true");
    if (reviewSubmitHelper) {
      const helperByStep = {
        "progress-intent": "Make a selection to continue.",
        "progress-topic": "Make a selection to continue.",
        "progress-outcome": "Make a selection to continue.",
        "progress-details": "Enter details to continue.",
        "progress-identity": "Complete this section to continue.",
        "progress-mailing": "Complete this section to continue.",
        "progress-resolution": "Enter details to continue.",
      };
      reviewSubmitHelper.textContent = complete
        ? "All required sections are complete. Select Review your submission to continue."
        : helperByStep[currentStepId] || "Complete this section to continue.";
    }
  }
}

function clearValidationMessage() {
  errorSummary.hidden = true;
  errorSummary.innerHTML = "";
}

function showValidationMessage(issues) {
  const list = issues.map((issue) => `<li><a href="#${issue.id}">${issue.label}</a></li>`).join("");
  errorSummary.hidden = false;
  errorSummary.innerHTML = `<p>Please complete the required fields before continuing:</p><ul>${list}</ul>`;
  const first = issues[0];
  const target = document.getElementById(first.id);
  if (target) {
    if (target.matches("fdic-choice-group")) {
      const firstOption = target.querySelector('input[type="radio"]');
      if (firstOption instanceof HTMLElement) {
        firstOption.focus();
        return;
      }
    }
    target.focus();
  }
}

function validateForm() {
  const issues = [];

  if (!state.intent) {
    issues.push({ id: "intent-group", label: "Select what you need help with" });
  }

  if (!state.topic) {
    issues.push({ id: "topic-group", label: "Select a concern topic" });
  }

  if (!state.details.trim()) {
    issues.push({ id: "details-input", label: "Provide a brief description" });
  }

  if (!state.outcome) {
    issues.push({ id: "outcome-group", label: "Select your desired outcome" });
  }

  if (!state.firstName.trim()) {
    issues.push({ id: "first-name-input", label: "Enter your first name" });
  }

  if (!state.lastName.trim()) {
    issues.push({ id: "last-name-input", label: "Enter your last name" });
  }

  if (!state.email.trim()) {
    issues.push({ id: "email-input", label: "Enter your email address" });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim())) {
    issues.push({ id: "email-input", label: "Enter a valid email address" });
  }

  if (!state.emailConfirm.trim()) {
    issues.push({ id: "email-confirm-input", label: "Confirm your email address" });
  } else if (state.email.trim().toLowerCase() !== state.emailConfirm.trim().toLowerCase()) {
    issues.push({ id: "email-confirm-input", label: "Email confirmation must match your email address" });
  }

  if (isBusinessPhoneRequired() && !state.businessPhone.trim()) {
    issues.push({ id: "business-phone-input", label: "Enter a business phone number" });
  }

  if (state.businessPhone.trim() && !/^[0-9+()\-\s.]{7,}$/.test(state.businessPhone.trim())) {
    issues.push({ id: "business-phone-input", label: "Enter a valid phone number" });
  }

  if (!state.mailingStreet.trim()) {
    issues.push({ id: "mailing-street-input", label: "Enter your mailing street address" });
  }

  if (!state.mailingCity.trim()) {
    issues.push({ id: "mailing-city-input", label: "Enter your mailing city" });
  }

  if (!state.mailingState) {
    issues.push({ id: "mailing-state-input", label: "Select your mailing state or territory" });
  }

  if (!state.mailingPostal.trim()) {
    issues.push({ id: "mailing-postal-input", label: "Enter your ZIP or postal code" });
  }

  if (!state.mailingCountry) {
    issues.push({ id: "mailing-country-input", label: "Select your mailing country" });
  }

  if (!state.desiredResolution.trim()) {
    issues.push({ id: "resolution-input", label: "Describe your desired resolution" });
  }

  return issues;
}

function showSummary() {
  summary.hidden = false;
  const workflow = getCurrentWorkflow();
  const topic = workflow?.topics.find((item) => item.value === state.topic);
  const outcome = OUTCOME_OPTIONS.find((item) => item.value === state.outcome);

  summaryCopy.textContent = `You are requesting to ${(workflow?.heading || defaultHeading).toLowerCase()}. Topic: ${topic?.title || "Not selected"}. Desired outcome: ${outcome?.title || "Not selected"}.`;
}

function handleIntentChange(value) {
  state.intent = value;
  state.topic = "";
  state.outcome = "";
  clearValidationMessage();
  summary.hidden = true;
  renderTopicAndOutcome();
}

intentGroup.addEventListener("choicechange", (event) => {
  if (event.detail.name !== "intent") {
    return;
  }
  handleIntentChange(event.detail.value);
});

topicGroup.addEventListener("choicechange", (event) => {
  if (event.detail.name !== "topic") {
    return;
  }
  state.topic = event.detail.value;
  state.outcome = "";
  summary.hidden = true;
  clearValidationMessage();
  renderTopicAndOutcome();
});

outcomeGroup.addEventListener("choicechange", (event) => {
  if (event.detail.name !== "outcome") {
    return;
  }
  state.outcome = event.detail.value;
  clearValidationMessage();
  summary.hidden = true;
  renderTopicAndOutcome();
});

const syncTextState = () => {
  state.details = detailsInput.value;
  state.firstName = firstNameInput.value;
  state.lastName = lastNameInput.value;
  state.email = emailInput.value;
  state.emailConfirm = emailConfirmInput.value;
  state.businessPhone = businessPhoneInput.value;
  state.mailingStreet = mailingStreetInput.value;
  state.mailingCity = mailingCityInput.value;
  state.mailingState = mailingStateInput.value;
  state.mailingPostal = mailingPostalInput.value;
  state.mailingCountry = mailingCountryInput.value;
  state.desiredResolution = resolutionInput.value;
  updateStepState();
};

[
  detailsInput,
  firstNameInput,
  lastNameInput,
  emailInput,
  emailConfirmInput,
  businessPhoneInput,
  mailingStreetInput,
  mailingCityInput,
  mailingStateInput,
  mailingPostalInput,
  mailingCountryInput,
  resolutionInput,
].forEach((el) => {
  el.addEventListener("input", syncTextState);
  el.addEventListener("change", syncTextState);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  syncTextState();

  const issues = validateForm();
  if (issues.length > 0) {
    showValidationMessage(issues);
    return;
  }

  clearValidationMessage();
  showSummary();
  updateEndpoint();

  const workflow = getCurrentWorkflow();
  const selectedTopic = workflow?.topics.find((topic) => topic.value === state.topic) || null;
  const outcome = OUTCOME_OPTIONS.find((item) => item.value === state.outcome) || null;
  const endpoint = selectedTopic ? ENDPOINTS[selectedTopic.endpointKey] || null : null;

  const draft = {
    intent: state.intent,
    workflowHeading: workflow?.heading || defaultHeading,
    workflowSubcopy: workflow?.subcopy || defaultSubcopy,
    topic: state.topic,
    topicTitle: selectedTopic?.title || "",
    topicDetail: selectedTopic?.detail || "",
    details: state.details.trim(),
    outcome: state.outcome,
    outcomeTitle: outcome?.title || "",
    firstName: state.firstName.trim(),
    lastName: state.lastName.trim(),
    email: state.email.trim(),
    businessPhone: state.businessPhone.trim(),
    mailingStreet: state.mailingStreet.trim(),
    mailingCity: state.mailingCity.trim(),
    mailingState: state.mailingState,
    mailingPostal: state.mailingPostal.trim(),
    mailingCountry: state.mailingCountry,
    desiredResolution: state.desiredResolution.trim(),
    endpointLabel: endpoint?.label || "",
    queueCode: endpoint?.queueCode || "",
    savedAt: new Date().toISOString(),
  };

  sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  window.location.href = `review-submission.html?mode=${encodeURIComponent(state.intent)}`;
});

window.addEventListener("pagehide", () => {
  if (contextualFaqController) {
    contextualFaqController.abort();
    contextualFaqController = null;
  }
});

renderIntentGroup();
populateStateOptions();
renderTopicAndOutcome();
syncTextState();
