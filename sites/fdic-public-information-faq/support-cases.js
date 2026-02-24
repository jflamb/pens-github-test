const CASE_HISTORY_STORAGE_KEY = "fdicSupportCaseHistory";

const table = document.getElementById("cases-table");
const tbody = document.getElementById("cases-tbody");
const empty = document.getElementById("cases-empty");

function loadCases() {
  try {
    const raw = localStorage.getItem(CASE_HISTORY_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function renderCases(cases) {
  if (!cases.length) {
    empty.hidden = false;
    table.hidden = true;
    return;
  }

  const rows = cases
    .slice()
    .reverse()
    .map((item) => {
      const submitted = item.submittedAt ? new Date(item.submittedAt).toLocaleString() : "Unknown";
      return `<tr>
        <td>${item.caseId || "Unknown"}</td>
        <td>${submitted}</td>
        <td>${item.workflowHeading || "Unknown"}</td>
        <td>${item.topicTitle || "Unknown"}</td>
        <td>${item.status || "Submitted"}</td>
      </tr>`;
    })
    .join("");

  tbody.innerHTML = rows;
  empty.hidden = true;
  table.hidden = false;
}

renderCases(loadCases());
