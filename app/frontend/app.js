const list = document.querySelector("#task-list");
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-title");
const count = document.querySelector("#task-count");
const statusPill = document.querySelector("#api-status");

async function api(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`API error ${response.status}`);
  return response.status === 204 ? null : response.json();
}

function render(tasks) {
  list.replaceChildren();
  count.textContent = `${tasks.length} task${tasks.length === 1 ? "" : "s"}`;
  for (const task of tasks) {
    const item = document.createElement("li");
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", async () => {
      await api(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: checkbox.checked })
      });
      await loadTasks();
    });
    const title = document.createElement("span");
    title.textContent = task.title;
    if (task.completed) title.className = "done";
    label.append(checkbox, title);
    const remove = document.createElement("button");
    remove.className = "delete";
    remove.textContent = "Delete";
    remove.addEventListener("click", async () => {
      await api(`/api/tasks/${task.id}`, { method: "DELETE" });
      await loadTasks();
    });
    item.append(label, remove);
    list.append(item);
  }
}

async function loadTasks() {
  render(await api("/api/tasks"));
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  await api("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  });
  input.value = "";
  await loadTasks();
});

(async () => {
  try {
    await api("/api/health");
    statusPill.textContent = "Backend connected";
    statusPill.classList.add("online");
    await loadTasks();
  } catch (error) {
    statusPill.textContent = "Backend unavailable";
    console.error(error);
  }
})();
