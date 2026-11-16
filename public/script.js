// Served by the backend itself (port 2005) -> same origin. Otherwise (Live Server...) call it directly.
const API = location.port === "2005" ? "" : "http://localhost:2005";
const DEPARTMENTS = ["IT", "HR", "Finance"];
const GAP_MS = 250; // the backend connects/disconnects Mongo on every request, so give it time to finish

const $ = id => document.getElementById(id);
const form = $("employeeForm"), formPanel = $("formPanel"), tbody = $("employeesTable");
let all = [], loadError = "", queue = Promise.resolve(), msgTimer;

/* ---------- API: one request at a time (backend can't handle overlapping connect/disconnect) ---------- */
function friendly(msg) {
  msg = String(msg);
  if (/E11000/.test(msg)) return "This email is already used by another employee.";
  if (/Cast to ObjectId/.test(msg)) return "Invalid employee id.";
  return msg;
}

async function once(path, opts) {
  try {
    const res = await fetch(API + path, { ...opts, headers: { "Content-Type": "application/json" } });
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!res.ok) throw new Error(friendly(data?.error || data?.message || data || `Request failed (${res.status})`));
    return data;
  } catch (e) {
    if (e instanceof TypeError) throw new Error("Cannot reach the server on port 2005. Is it running?");
    throw e;
  } finally {
    await new Promise(r => setTimeout(r, GAP_MS));
  }
}

function api(path, opts = {}, retries = 0) {
  const job = queue.then(async () => {
    for (let i = 0; ; i++) {
      try { return await once(path, opts); } catch (e) { if (i >= retries) throw e; }
    }
  });
  queue = job.catch(() => {});
  return job;
}

/* ---------- helpers ---------- */
const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const money = v => Number.isFinite(Number(v)) ? Number(v).toLocaleString("en-US") : "-";
const day = v => (v ? String(v).slice(0, 10) : "-");

function showMessage(text, isError = false) {
  clearTimeout(msgTimer);
  $("message").textContent = text;
  $("message").classList.toggle("error", isError);
  if (text) msgTimer = setTimeout(() => showMessage(""), 5000);
}

/* ---------- list: load everything once, filter in the browser ---------- */
// Backend search is exact-match and /employees needs a department, so the browser does partial,
// case-insensitive search + department/status filtering on the full list from GET /.
async function loadEmployees() {
  tbody.innerHTML = '<tr><td colspan="10" class="empty">Loading employees...</td></tr>';
  loadError = "";
  try {
    // GET "/" is shadowed by express.static (it serves index.html), so read each department instead.
    const merged = [];
    for (const d of DEPARTMENTS) {
      const data = await api(`/employees?department=${encodeURIComponent(d)}`, {}, 1);
      if (!Array.isArray(data)) throw new Error("Unexpected response from the server.");
      merged.push(...data);
    }
    all = merged;
  } catch (e) {
    all = [];
    loadError = `Could not load employees: ${e.message}`;
    showMessage(loadError, true);
  }
  render();
}

function render() {
  const q = $("searchInput").value.trim().toLowerCase();
  const dep = $("departmentFilter").value, st = $("statusFilter").value;
  const list = all.filter(e =>
    (!q || `${e.name} ${e.email}`.toLowerCase().includes(q)) &&
    (!dep || e.department === dep) &&
    (st === "all" || (st === "active") === (e.active === true))
  );
  $("employeeCount").textContent = `${list.length} employee${list.length === 1 ? "" : "s"}` +
    (list.length !== all.length ? ` of ${all.length}` : "");

  tbody.innerHTML = list.length ? list.map(e => `
    <tr>
      <td>${esc(e.name)}<small>${esc(e.email)}</small></td>
      <td>${esc(e.department)}</td>
      <td class="num">${esc(e.age)}</td>
      <td class="num">${money(e.salary)}</td>
      <td class="num">${money(e.bonus ?? 0)}</td>
      <td class="num">${esc(e.hoursWorked ?? 0)}</td>
      <td class="num">${day(e.joinedAt)}</td>
      <td class="skills">${esc((e.skills || []).join(", ")) || "-"}</td>
      <td><span class="status ${e.active ? "" : "inactive"}">${e.active ? "Active" : "Inactive"}</span></td>
      <td><div class="action-buttons">
        <button type="button" data-action="edit" data-id="${esc(e._id)}">Edit</button>
        <button type="button" class="delete-btn" data-action="delete" data-id="${esc(e._id)}">Delete</button>
      </div></td>
    </tr>`).join("")
    : `<tr><td colspan="10" class="empty">${loadError || (all.length ? "No employees match your filters." : "No employees yet. Click “Add employee” to create one.")}</td></tr>`;
}

/* ---------- form ---------- */
function showForm(e = null) {
  form.reset();
  $("formError").textContent = "";
  $("employeeId").value = e?._id || "";
  $("formTitle").textContent = e ? "Edit employee" : "Add employee";
  $("saveBtn").textContent = e ? "Update employee" : "Save employee";
  $("name").value = e?.name || "";
  $("email").value = e?.email || "";
  $("age").value = e?.age ?? "";
  $("department").value = e?.department || "";
  $("salary").value = e?.salary ?? "";
  $("hoursWorked").value = e?.hoursWorked ?? 0;
  $("bonus").value = e?.bonus ?? 0;
  $("active").checked = e ? e.active !== false : true;
  $("skills").value = (e?.skills || []).join(", ");
  $("joinedAt").value = e ? (e.joinedAt ? day(e.joinedAt) : "")
                          : new Date().toLocaleDateString("en-CA");
  formPanel.hidden = false;
  formPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  $("name").focus();
}

function hideForm() {
  formPanel.hidden = true;
  form.reset();
  $("employeeId").value = "";
}

function formToEmployee() {
  const emp = {
    name: $("name").value.trim(),
    email: $("email").value.trim().toLowerCase(),
    age: Number($("age").value),
    department: $("department").value,
    salary: Number($("salary").value),
    hoursWorked: Number($("hoursWorked").value || 0),
    bonus: Number($("bonus").value || 0),
    active: $("active").checked,
    skills: $("skills").value.split(",").map(s => s.trim()).filter(Boolean)
  };
  if ($("joinedAt").value) emp.joinedAt = `${$("joinedAt").value}T00:00:00.000Z`; // UTC, so the day never shifts
  return emp;
}

// The backend's PATCH skips schema validation (updateOne without runValidators), so validate fully here.
function validate(e) {
  if (!e.name) return "Name is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email)) return "Enter a valid email address.";
  if (!Number.isInteger(e.age) || e.age < 18 || e.age > 65) return "Age must be a whole number between 18 and 65.";
  if (!DEPARTMENTS.includes(e.department)) return "Choose a department.";
  if (!Number.isFinite(e.salary) || e.salary < 0 || $("salary").value === "") return "Salary must be 0 or more.";
  if (!Number.isFinite(e.hoursWorked) || e.hoursWorked < 0) return "Hours worked must be 0 or more.";
  if (!Number.isFinite(e.bonus) || e.bonus < 0) return "Bonus must be 0 or more.";
  return "";
}

form.addEventListener("submit", async ev => {
  ev.preventDefault();
  const id = $("employeeId").value, emp = formToEmployee(), err = validate(emp);
  $("formError").textContent = err;
  if (err) return;

  $("saveBtn").disabled = true;
  try {
    if (id) {
      // PATCH returns the update result (not the employee), so check matchedCount and reload.
      const r = await api(`/employees/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(emp) });
      if (r?.matchedCount === 0) throw new Error("This employee no longer exists.");
      showMessage("Employee updated.");
    } else {
      await api("/employees", { method: "POST", body: JSON.stringify(emp) });
      showMessage("Employee added.");
    }
    hideForm();
    await loadEmployees();
  } catch (e) {
    $("formError").textContent = `Could not save employee: ${e.message}`;
  } finally {
    $("saveBtn").disabled = false;
  }
});

/* ---------- table actions ---------- */
tbody.addEventListener("click", async ev => {
  const btn = ev.target.closest("button[data-action]");
  if (!btn) return;
  const { action, id } = btn.dataset;
  const emp = all.find(e => e._id === id);

  if (action === "edit" && emp) return showForm(emp);

  if (action === "delete") {
    if (!confirm(`Delete ${emp?.name || "this employee"}? This can't be undone.`)) return;
    btn.disabled = true;
    try {
      const r = await api(`/employees/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (r?.deletedCount === 0) throw new Error("This employee was already deleted.");
      showMessage("Employee deleted.");
      await loadEmployees();
    } catch (e) {
      showMessage(`Could not delete employee: ${e.message}`, true);
      btn.disabled = false;
    }
  }
});

/* ---------- wiring ---------- */
$("showFormBtn").addEventListener("click", () => showForm());
$("cancelBtn").addEventListener("click", hideForm);
$("refreshBtn").addEventListener("click", loadEmployees);
["searchInput", "departmentFilter", "statusFilter"].forEach(id =>
  $(id).addEventListener(id === "searchInput" ? "input" : "change", render));

loadEmployees();