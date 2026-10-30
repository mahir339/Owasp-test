const express = require("express");
const path = require("path");
const _ = require("lodash");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

let tasks = [
  { id: 1, title: "Install project dependencies", completed: true },
  { id: 2, title: "Run OWASP dep-scan", completed: false },
  { id: 3, title: "Review vulnerability findings", completed: false }
];

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "OWASP Security Lab" });
});

app.get("/api/tasks", (_req, res) => {
  res.json(_.orderBy(tasks, ["id"], ["asc"]));
});

app.post("/api/tasks", (req, res) => {
  const title = String(req.body.title || "").trim();
  if (!title) return res.status(400).json({ error: "Task title is required" });
  const task = { id: Date.now(), title: title.slice(0, 120), completed: false };
  tasks.push(task);
  res.status(201).json(task);
});

app.patch("/api/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found" });
  task.completed = Boolean(req.body.completed);
  res.json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const before = tasks.length;
  tasks = tasks.filter(t => t.id !== id);
  if (tasks.length === before) return res.status(404).json({ error: "Task not found" });
  res.status(204).end();
});

app.get("/api/lab-info", (_req, res) => {
  res.json({
    purpose: "OWASP dep-scan training",
    dependencies: {
      express: require("express/package.json").version,
      lodash: require("lodash/package.json").version,
      axios: require("axios/package.json").version
    }
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`OWASP Security Lab running on http://localhost:${PORT}`);
});
