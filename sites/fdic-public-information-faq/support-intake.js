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
        value: "bank_data",
        title: "Bank history, location, or data tools",
        detail: "BankFind, failed-bank records, or published financial reports.",
        endpointKey: "fdicdirform",
      },
      {
        value: "general_question",
        title: "General regulatory question",
        detail: "A broad question about FDIC-supervised banking topics.",
        endpointKey: "fdiccaform",
      },
    ],
    detailsLegend: "What question do you need answered?",
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
    this.setAttribute("role", "group");
    this.setAttribute("aria-labelledby", `${this.config.name}-legend`);
    this.setAttribute("aria-required", this.config.required ? "true" : "false");
  }
}

customElements.define("fdic-choice-group", FDICChoiceGroup);

const modeParam = new URLSearchParams(window.location.search).get("mode");
const initialMode = modeParam && WORKFLOWS[modeParam] ? modeParam : "report";

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
const form = document.getElementById("support-intake-form");
const reviewSubmissionButton = document.getElementById("review-submission-btn");
const errorSummary = document.getElementById("form-errors");
const liveStatus = document.getElementById("intake-status");
const summary = document.getElementById("flow-summary");
const summaryCopy = document.getElementById("flow-summary-copy");
const progressIntent = document.getElementById("progress-intent");
const progressTopic = document.getElementById("progress-topic");
const progressDetails = document.getElementById("progress-details");
const progressOutcome = document.getElementById("progress-outcome");
const progressIdentity = document.getElementById("progress-identity");
const progressMailing = document.getElementById("progress-mailing");
const progressResolution = document.getElementById("progress-resolution");

function getCurrentWorkflow() {
  return WORKFLOWS[state.intent] || WORKFLOWS.report;
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
  updateStepState();
}

function updateEndpoint() {
  const workflow = getCurrentWorkflow();
  const selectedTopic = workflow.topics.find((topic) => topic.value === state.topic);

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
  endpointLinkWrap.textContent = "No additional form handoff is required.";
}

function updateStepState() {
  const workflow = getCurrentWorkflow();
  const selectedTopic = workflow.topics.find((topic) => topic.value === state.topic);

  const checks = [
    Boolean(state.intent),
    Boolean(selectedTopic),
    Boolean(state.details.trim()),
    Boolean(state.outcome),
    isIdentityComplete(),
    isMailingComplete(),
    Boolean(state.desiredResolution.trim()),
  ];
  const completeCount = checks.filter(Boolean).length;

  const setProgressItem = (node, label, complete, isCurrentStep) => {
    if (!node) {
      return;
    }
    node.classList.toggle("is-complete", complete);
    node.classList.toggle("is-incomplete", !complete);
    node.removeAttribute("aria-current");
    if (isCurrentStep) {
      node.setAttribute("aria-current", "step");
    }
    node.setAttribute("aria-label", `${label}: ${complete ? "Complete" : "Not started"}`);
    node.innerHTML = `<span class="progress-label">${label}</span>`;
  };

  const progressItems = [
    { node: progressIntent, label: "What you need help with", complete: Boolean(state.intent) },
    { node: progressTopic, label: "Concern topic", complete: Boolean(selectedTopic) },
    { node: progressDetails, label: "Issue details", complete: Boolean(state.details.trim()) },
    { node: progressOutcome, label: "Desired outcome", complete: Boolean(state.outcome) },
    { node: progressIdentity, label: "Contact information", complete: isIdentityComplete() },
    { node: progressMailing, label: "Mailing address", complete: isMailingComplete() },
    { node: progressResolution, label: "Desired resolution details", complete: Boolean(state.desiredResolution.trim()) },
  ];
  const firstIncompleteIndex = progressItems.findIndex((item) => !item.complete);

  for (let index = 0; index < progressItems.length; index += 1) {
    const item = progressItems[index];
    setProgressItem(item.node, item.label, item.complete, index === firstIncompleteIndex);
  }

  liveStatus.textContent = `Progress updated. ${completeCount} of 7 required sections complete.`;

  if (reviewSubmissionButton) {
    const complete = isFormComplete();
    reviewSubmissionButton.disabled = !complete;
    reviewSubmissionButton.setAttribute("aria-disabled", complete ? "false" : "true");
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
  const topic = workflow.topics.find((item) => item.value === state.topic);
  const outcome = OUTCOME_OPTIONS.find((item) => item.value === state.outcome);

  summaryCopy.textContent = `You are requesting to ${workflow.heading.toLowerCase()}. Topic: ${topic?.title || "Not selected"}. Desired outcome: ${outcome?.title || "Not selected"}.`; 
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
  const selectedTopic = workflow.topics.find((topic) => topic.value === state.topic) || null;
  const outcome = OUTCOME_OPTIONS.find((item) => item.value === state.outcome) || null;
  const endpoint = selectedTopic ? ENDPOINTS[selectedTopic.endpointKey] || null : null;

  const draft = {
    intent: state.intent,
    workflowHeading: workflow.heading,
    workflowSubcopy: workflow.subcopy,
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

renderIntentGroup();
populateStateOptions();
renderTopicAndOutcome();
syncTextState();
