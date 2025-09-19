// Select elements
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskCategory = document.getElementById("taskCategory");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const searchTask = document.getElementById("searchTask");
const clearCompletedBtn = document.getElementById("clearCompleted");
const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const toggleModeBtn = document.getElementById("toggle-mode");

// Load dark mode preference
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
}

// Load tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Add Task
addTaskBtn.addEventListener("click", () => {
  if (taskInput.value.trim() === "") return;

  const task = {
    id: Date.now(),
    text: taskInput.value,
    date: taskDate.value,
    category: taskCategory.value,
    completed: false,
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  taskDate.value = "";
});

// Render Tasks
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks.filter((t) =>
    t.text.toLowerCase().includes(searchTask.value.toLowerCase())
  );

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    li.innerHTML = `
      <div>
        <strong>${task.text}</strong> 
        <small>[${task.category}] ${task.date || ""}</small>
      </div>
      <div>
        <button onclick="toggleComplete(${task.id})">✔</button>
        <button onclick="editTask(${task.id})">✏️</button>
        <button onclick="deleteTask(${task.id})">🗑️</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  updateStats();
}

// Toggle Complete
function toggleComplete(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

// Edit Task
function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  const newText = prompt("Edit Task:", task.text);
  if (newText) task.text = newText;
  saveTasks();
  renderTasks();
}

// Delete Task
function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  renderTasks();
}

// Clear Completed
clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  renderTasks();
});

// Search
searchTask.addEventListener("input", renderTasks);

// Save Tasks
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update Stats
function updateStats() {
  totalTasksEl.textContent = tasks.length;
  completedTasksEl.textContent = tasks.filter((t) => t.completed).length;
}

// Dark Mode Toggle
toggleModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
});

// Initial Render
renderTasks();
