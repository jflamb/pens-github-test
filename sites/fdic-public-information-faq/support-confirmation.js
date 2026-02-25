const SUBMITTED_STORAGE_KEY = "fdicSupportSubmittedCase";

const caseNode = document.getElementById("confirm-case");
const submittedNode = document.getElementById("confirm-submitted");
const summaryNode = document.getElementById("confirm-summary");

const intentNode = document.getElementById("confirm-intent");
const topicNode = document.getElementById("confirm-topic");
const outcomeNode = document.getElementById("confirm-outcome");
const nameNode = document.getElementById("confirm-name");
const emailNode = document.getElementById("confirm-email");
const phoneNode = document.getElementById("confirm-phone");
const addressNode = document.getElementById("confirm-address");
const resolutionNode = document.getElementById("confirm-resolution");
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
  nameNode.textContent = formatName(data);
  emailNode.textContent = data.email || "Not provided";
  phoneNode.textContent = data.businessPhone || "Not provided";
  addressNode.textContent = formatAddress(data);
  resolutionNode.textContent = data.desiredResolution || "Not provided";
  endpointNode.textContent = data.endpointLabel
    ? `${data.endpointLabel}${data.queueCode ? ` (${data.queueCode})` : ""}`
    : "Not provided";

  summaryNode.hidden = false;
}

function formatName(data) {
  const first = (data.firstName || "").trim();
  const last = (data.lastName || "").trim();
  return [first, last].filter(Boolean).join(" ") || "Not provided";
}

function formatAddress(data) {
  const parts = [
    data.mailingStreet,
    [data.mailingCity, data.mailingState].filter(Boolean).join(", "),
    data.mailingPostal,
    data.mailingCountry,
  ]
    .map((part) => (part || "").trim())
    .filter(Boolean);
  return parts.join(" • ") || "Not provided";
}

const submitted = loadSubmitted();
if (!submitted || !submitted.caseId) {
  renderMissing();
} else {
  renderSubmitted(submitted);
}
