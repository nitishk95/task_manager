const API_URL = "https://task-manager-api-ag04.onrender.com/api/task";

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const filterStatus = document.getElementById("filterStatus");

const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const statusInput = document.getElementById("status");

let editingTaskId = null;




async function fetchTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  renderTasks(tasks);
}



function renderTasks(tasks) {
  taskList.innerHTML = "";

  const filter = filterStatus.value;

  tasks
    .filter(t => !filter || t.status === filter)
    .forEach(task => {
      const card = document.createElement("div");
      card.className = "task-card";

      card.innerHTML = `
        <div class="task-top">
          <span class="task-title">${task.title}</span>
          <span class="status ${task.status}">${task.status}</span>
        </div>

        <p class="task-desc">${task.description || ""}</p>

        <div class="actions">
          <button class="edit">Edit</button>
          <button class="delete">Delete</button>
        </div>
      `;

      card.querySelector(".delete").onclick = () => deleteTask(task._id);
      card.querySelector(".edit").onclick = () => startEdit(task);

      taskList.appendChild(card);
    });
}




taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const taskData = {
    title: titleInput.value,
    description: descriptionInput.value,
    status: statusInput.value
  };

  // UPDATE
  if (editingTaskId) {
    await fetch(`${API_URL}/${editingTaskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData)
    });

    editingTaskId = null;
    taskForm.querySelector("button").innerText = "Add Task";
  }
  // CREATE
  else {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData)
    });
  }

  taskForm.reset();
  fetchTasks();
});




async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchTasks();
}




function startEdit(task) {
  editingTaskId = task._id;

  titleInput.value = task.title;
  descriptionInput.value = task.description;
  statusInput.value = task.status;

  taskForm.querySelector("button").innerText = "Update Task";

  window.scrollTo({ top: 0, behavior: "smooth" });
}




filterStatus.addEventListener("change", fetchTasks);




fetchTasks();
