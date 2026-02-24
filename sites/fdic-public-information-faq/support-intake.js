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

const CONTACT_OPTIONS = [
  {
    value: "email",
    title: "Email",
    detail: "Best when you want written updates and links.",
  },
  {
    value: "phone",
    title: "Phone",
    detail: "Best when follow-up may need quick clarification.",
  },
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

  get value() {
    const checked = this.querySelector('input[type="radio"]:checked');
    return checked ? checked.value : "";
  }

  focusControl() {
    const target = this.querySelector('input[type="radio"]:checked') || this.querySelector('input[type="radio"]');
    if (target) {
      target.focus();
    }
  }

  validate() {
    if (!this.config?.required) {
      return true;
    }
    return Boolean(this.value);
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

    const legendRequired = this.config.required
      ? ' <span class="report-required-marker" aria-hidden="true">*</span>'
      : "";

    const radios = this.config.options
      .map((option, index) => {
        const checked = option.value === this.selectedValue;
        const id = `${this.config.name}-${index}`;
        const selectedClass = checked ? " is-selected" : "";
        const detail = option.detail
          ? `<span class="report-option-detail">${option.detail}</span>`
          : "";

        return `<label class="report-option${selectedClass}" for="${id}">
            <input id="${id}" type="radio" name="${this.config.name}" value="${option.value}" ${checked ? "checked" : ""} ${this.config.required ? 'aria-required="true"' : ""} />
            <span class="report-option__text">
              <strong>${option.title}</strong>
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
  residentState: "",
  contactMethod: "",
  contactValue: "",
};

const heading = document.getElementById("intake-heading");
const subcopy = document.getElementById("intake-subcopy");
const intentGroup = document.getElementById("intent-group");
const topicGroup = document.getElementById("topic-group");
const outcomeGroup = document.getElementById("outcome-group");
const contactGroup = document.getElementById("contact-group");
const topicWrapper = document.getElementById("topic-wrapper");
const detailsWrapper = document.getElementById("details-wrapper");
const outcomeWrapper = document.getElementById("outcome-wrapper");
const stateWrapper = document.getElementById("state-wrapper");
const contactWrapper = document.getElementById("contact-wrapper");
const contactValueWrapper = document.getElementById("contact-value-wrapper");
const endpointWrapper = document.getElementById("endpoint-wrapper");
const endpointCopy = document.getElementById("endpoint-copy");
const endpointLinkWrap = document.getElementById("endpoint-link-wrap");
const detailsLegend = document.getElementById("details-legend");
const detailsInput = document.getElementById("details-input");
const stateInput = document.getElementById("state-input");
const contactValueLabel = document.getElementById("contact-value-label");
const contactValueInput = document.getElementById("contact-value-input");
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
const progressState = document.getElementById("progress-state");
const progressContact = document.getElementById("progress-contact");

function getCurrentWorkflow() {
  return WORKFLOWS[state.intent] || WORKFLOWS.report;
}

function isFormComplete() {
  return Boolean(
    state.intent &&
    state.topic &&
    state.details.trim() &&
    state.outcome &&
    state.residentState &&
    state.contactMethod &&
    state.contactValue.trim(),
  );
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

  contactGroup.setConfig(
    {
      name: "contact-method",
      legend: "How can we contact you if we need more information?",
      required: true,
      options: CONTACT_OPTIONS,
      help: "Select one contact method. We only use this to follow up about your request.",
    },
    state.contactMethod,
  );

  topicWrapper.hidden = false;
  detailsWrapper.hidden = !state.topic;
  outcomeWrapper.hidden = !state.topic;
  stateWrapper.hidden = !state.topic;
  contactWrapper.hidden = !state.topic;
  contactValueWrapper.hidden = !(state.topic && state.contactMethod);
  endpointWrapper.hidden = !(state.topic && state.outcome && state.residentState && state.contactValue.trim());

  updateEndpoint();
  updateContactField();
  updateStepState();
}

function populateStateOptions() {
  if (!stateInput || stateInput.options.length > 1) {
    return;
  }
  const options = US_STATES_AND_TERRITORIES.map((name) => `<option value="${name}">${name}</option>`).join("");
  stateInput.insertAdjacentHTML("beforeend", options);
}

function updateContactField() {
  if (!contactValueInput || !contactValueLabel) {
    return;
  }
  if (!state.contactMethod) {
    contactValueWrapper.hidden = true;
    contactValueInput.value = "";
    contactValueInput.type = "text";
    contactValueInput.placeholder = "";
    contactValueInput.removeAttribute("pattern");
    return;
  }

  contactValueWrapper.hidden = false;
  if (state.contactMethod === "email") {
    contactValueLabel.innerHTML = 'Email address <span class="report-required-marker" aria-hidden="true">*</span>';
    contactValueInput.type = "email";
    contactValueInput.placeholder = "name@example.gov";
    contactValueInput.pattern = "";
  } else {
    contactValueLabel.innerHTML = 'Phone number <span class="report-required-marker" aria-hidden="true">*</span>';
    contactValueInput.type = "tel";
    contactValueInput.placeholder = "555-555-5555";
    contactValueInput.pattern = "^[0-9+()\\-\\s.]{7,}$";
  }
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
  const completeCount = [
    Boolean(state.intent),
    Boolean(state.topic),
    Boolean(state.details.trim()),
    Boolean(state.outcome),
    Boolean(state.residentState),
    Boolean(state.contactMethod && state.contactValue.trim()),
  ].filter(Boolean).length;

  const setProgressItem = (node, label, complete) => {
    if (!node) {
      return;
    }
    node.classList.toggle("is-complete", complete);
    node.classList.toggle("is-incomplete", !complete);
    node.setAttribute("aria-label", `${label}: ${complete ? "Complete" : "Not started"}`);
    node.innerHTML = `<span class="progress-label">${label}</span>`;
  };

  setProgressItem(progressIntent, "What you need help with", Boolean(state.intent));
  setProgressItem(progressTopic, "Concern topic", Boolean(selectedTopic));
  setProgressItem(progressDetails, "Issue details", Boolean(state.details.trim()));
  setProgressItem(progressOutcome, "Desired outcome", Boolean(state.outcome));
  setProgressItem(progressState, "State of residence", Boolean(state.residentState));
  setProgressItem(progressContact, "Follow-up contact", Boolean(state.contactMethod && state.contactValue.trim()));

  liveStatus.textContent = `Progress updated. ${completeCount} of 6 required sections complete.`;

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

  if (!state.residentState) {
    issues.push({ id: "state-input", label: "Select your state of residence" });
  }

  if (!state.contactMethod) {
    issues.push({ id: "contact-group", label: "Select a follow-up contact method" });
  }

  if (!state.contactValue.trim()) {
    issues.push({ id: "contact-value-input", label: "Provide your follow-up contact details" });
  } else if (state.contactMethod === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.contactValue.trim())) {
    issues.push({ id: "contact-value-input", label: "Enter a valid email address for follow-up" });
  } else if (state.contactMethod === "phone" && !/^[0-9+()\-\s.]{7,}$/.test(state.contactValue.trim())) {
    issues.push({ id: "contact-value-input", label: "Enter a valid phone number for follow-up" });
  }

  return issues;
}

function showSummary() {
  summary.hidden = false;
  const workflow = getCurrentWorkflow();
  const topic = workflow.topics.find((item) => item.value === state.topic);
  const outcome = OUTCOME_OPTIONS.find((item) => item.value === state.outcome);
  const contactLabel = state.contactMethod === "email" ? "Email" : state.contactMethod === "phone" ? "Phone" : "Not selected";
  summaryCopy.textContent = `You are requesting to ${workflow.heading.toLowerCase()}. Topic: ${topic?.title || "Not selected"}. Desired outcome: ${outcome?.title || "Not selected"}. State: ${state.residentState || "Not selected"}. Follow-up: ${contactLabel}.`;
}

intentGroup.addEventListener("choicechange", (event) => {
  if (event.detail.name !== "intent") {
    return;
  }
  state.intent = event.detail.value;
  state.topic = "";
  state.outcome = "";
  state.details = "";
  state.residentState = "";
  state.contactMethod = "";
  state.contactValue = "";
  detailsInput.value = "";
  stateInput.value = "";
  contactValueInput.value = "";
  clearValidationMessage();
  summary.hidden = true;
  renderTopicAndOutcome();
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

contactGroup.addEventListener("choicechange", (event) => {
  if (event.detail.name !== "contact-method") {
    return;
  }
  state.contactMethod = event.detail.value;
  state.contactValue = "";
  contactValueInput.value = "";
  clearValidationMessage();
  summary.hidden = true;
  updateContactField();
  updateStepState();
});

detailsInput.addEventListener("input", () => {
  state.details = detailsInput.value;
  updateStepState();
});

stateInput.addEventListener("change", () => {
  state.residentState = stateInput.value;
  updateEndpoint();
  updateStepState();
});

contactValueInput.addEventListener("input", () => {
  state.contactValue = contactValueInput.value;
  updateEndpoint();
  updateStepState();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  state.details = detailsInput.value;
  state.residentState = stateInput.value;
  state.contactValue = contactValueInput.value;

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
    residentState: state.residentState,
    contactMethod: state.contactMethod,
    contactValue: state.contactValue.trim(),
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
