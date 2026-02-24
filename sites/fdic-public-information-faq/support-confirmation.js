const SUBMITTED_STORAGE_KEY = "fdicSupportSubmittedCase";

const caseNode = document.getElementById("confirm-case");
const submittedNode = document.getElementById("confirm-submitted");
const summaryNode = document.getElementById("confirm-summary");

const intentNode = document.getElementById("confirm-intent");
const topicNode = document.getElementById("confirm-topic");
const outcomeNode = document.getElementById("confirm-outcome");
const stateNode = document.getElementById("confirm-state");
const contactNode = document.getElementById("confirm-contact");
const endpointNode = document.getElementById("confirm-endpoint");

function loadSubmitted() {
  try {
    const raw = sessionStorage.getItem(SUBMITTED_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function renderMissing() {
  caseNode.textContent = "No recent submission was found in this session.";
  submittedNode.textContent = "Please return to the form and submit a request.";
  summaryNode.hidden = true;
}

function renderSubmitted(data) {
  const submittedDate = new Date(data.submittedAt);
  caseNode.textContent = `Confirmation number: ${data.caseId}`;
  submittedNode.textContent = `Submitted on ${submittedDate.toLocaleString()}. Keep this number for follow-up.`;

  intentNode.textContent = data.workflowHeading || "Not provided";
  topicNode.textContent = data.topicTitle || "Not provided";
  outcomeNode.textContent = data.outcomeTitle || "Not provided";
  stateNode.textContent = data.residentState || "Not provided";
  contactNode.textContent = formatContact(data);
  endpointNode.textContent = data.endpointLabel
    ? `${data.endpointLabel}${data.queueCode ? ` (${data.queueCode})` : ""}`
    : "Not provided";

  summaryNode.hidden = false;
}

function formatContact(data) {
  const value = data.contactValue || "";
  if (!value) {
    return "Not provided";
  }
  if (data.contactMethod === "email") {
    return `Email: ${value}`;
  }
  if (data.contactMethod === "phone") {
    return `Phone: ${value}`;
  }
  return value;
}

const submitted = loadSubmitted();
if (!submitted || !submitted.caseId) {
  renderMissing();
} else {
  renderSubmitted(submitted);
}
