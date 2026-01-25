const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTask");
const titleInput = document.getElementById("title");
const descInput = document.getElementById("description");
const statusSelect = document.getElementById("status");
const searchInput = document.getElementById("search");

let tasks = [];
let currentFilter = "todas";

addTaskBtn.onclick = () => {
  if (!titleInput.value) return;

  tasks.push({
    id: Date.now(),
    title: titleInput.value,
    description: descInput.value,
    status: statusSelect.value
  });

  titleInput.value = "";
  descInput.value = "";

  renderTasks();
};

function renderTasks() {
  taskList.innerHTML = "";

  tasks
    .filter(t =>
      (currentFilter === "todas" || t.status === currentFilter) &&
      t.title.toLowerCase().includes(searchInput.value.toLowerCase())
    )
    .forEach(task => {
      const card = document.createElement("div");
      card.className = "task-card";
      card.dataset.status = task.status;

      card.innerHTML = `
        <h4>${task.title}</h4>
        <p>${task.description}</p>

        <select onchange="updateStatus(${task.id}, this.value)">
          <option value="pendente" ${task.status==="pendente"?"selected":""}>Pendente</option>
          <option value="andamento" ${task.status==="andamento"?"selected":""}>Em andamento</option>
          <option value="concluida" ${task.status==="concluida"?"selected":""}>Concluída</option>
        </select>

        <div class="task-actions">
          <button onclick="deleteTask(${task.id})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;

      taskList.appendChild(card);
    });
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
}

function updateStatus(id, status) {
  const task = tasks.find(t => t.id === id);
  task.status = status;
  renderTasks();
}

document.querySelectorAll(".filters button").forEach(btn => {
  btn.onclick = () => {
    document.querySelector(".filters .active").classList.remove("active");
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  };
});

searchInput.oninput = renderTasks;

document.querySelectorAll("nav button").forEach(btn => {
  btn.onclick = () => {
    document.querySelector("nav .active").classList.remove("active");
    btn.classList.add("active");

    document.querySelector(".tab.active").classList.remove("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  };
});
