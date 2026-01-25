const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTask");

const titleInput = document.getElementById("title");
const statusSelect = document.getElementById("status");

let tasks = [];
let currentFilter = "todas";

/* ADICIONAR TAREFA */
addTaskBtn.onclick = () => {
  if (!titleInput.value) return;

  tasks.push({
    title: titleInput.value,
    status: statusSelect.value
  });

  titleInput.value = "";
  renderTasks();
};

/* RENDERIZAR */
function renderTasks() {
  taskList.innerHTML = "";

  tasks
    .filter(task =>
      currentFilter === "todas" || task.status === currentFilter
    )
    .forEach(task => {
      const card = document.createElement("div");
      card.className = "task-card";
      card.dataset.status = task.status;
      card.textContent = task.title;
      taskList.appendChild(card);
    });
}

/* FILTROS */
document.querySelectorAll(".filters button").forEach(btn => {
  btn.onclick = () => {
    document.querySelector(".filters .active").classList.remove("active");
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  };
});

/* TABS */
document.querySelectorAll("nav button").forEach(btn => {
  btn.onclick = () => {
    document.querySelector("nav .active").classList.remove("active");
    btn.classList.add("active");

    document.querySelector(".tab.active").classList.remove("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  };
});
