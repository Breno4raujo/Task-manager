const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTask");
const titleInput = document.getElementById("title");
const descInput = document.getElementById("description");
const statusSelect = document.getElementById("status");
const searchInput = document.getElementById("search");

const titleLimitEl = document.getElementById("titleLimit");
const descLimitEl = document.getElementById("descLimit");
const searchLimitEl = document.getElementById("searchLimit");

/* CONSTANTES DE TEMPO */
const DAY = 1000 * 60 * 60 * 24;
const DELETE_AFTER = 8;

/* ESTADO DA APLICAÇÃO */
let tasks = [];
let currentFilter = "todas";

/* CONTADOR DE CARACTERES */
function updateLimit(input, limit, counterEl) {
  if (!counterEl) return;

  if (input.value.length > limit) {
    input.value = input.value.slice(0, limit);
  }

  counterEl.textContent = `${input.value.length}/${limit}`;
}

/* CRIAR NOVA TAREFA */
addTaskBtn.onclick = () => {
  if (!titleInput.value.trim()) return;

  const now = Date.now();

  tasks.push({
    id: now,
    title: titleInput.value.trim(),
    description: descInput.value.trim(),
    status: statusSelect.value,
    completedAt: statusSelect.value === "concluida" ? now : null
  });

  clearForm();
  renderTasks();
};

/* LIMPAR FORMULÁRIO */
function clearForm() {
  titleInput.value = "";
  descInput.value = "";
  statusSelect.value = "pendente";

  updateLimit(titleInput, 350, titleLimitEl);
  updateLimit(descInput, 1500, descLimitEl);
}

/* RENDERIZA TODAS AS TAREFAS */
function renderTasks() {
  cleanupCompleted();

  taskList.innerHTML = "";

  tasks
    .filter(task =>
      (currentFilter === "todas" || task.status === currentFilter) &&
      task.title.toLowerCase().includes(searchInput.value.toLowerCase())
    )
    .forEach(task => {
      const card = createTaskCard(task);
      taskList.appendChild(card);
    });
}

/* CRIA CARD INDIVIDUAL */
function createTaskCard(task) {
  const card = document.createElement("div");
  card.className = "task-card";
  card.dataset.status = task.status;

  let warning = "";
  if (task.status === "concluida" && task.completedAt) {
    const daysLeft =
      DELETE_AFTER -
      Math.floor((Date.now() - task.completedAt) / DAY);

    if (daysLeft > 0) {
      warning = `
        <div class="expire-warning">
          Esse card será excluído em ${daysLeft} dia(s)
        </div>`;
    }
  }

  card.innerHTML = `
    ${warning}

    <input
      class="edit-title"
      maxlength="350"
      value="${task.title}"
      oninput="editTask(${task.id}, 'title', this.value)"
    />

    <textarea
      class="edit-desc"
      maxlength="1500"
      oninput="editTask(${task.id}, 'description', this.value)"
    >${task.description}</textarea>

    <select onchange="updateStatus(${task.id}, this.value)">
      <option value="pendente" ${task.status === "pendente" ? "selected" : ""}>
        Pendente
      </option>
      <option value="andamento" ${task.status === "andamento" ? "selected" : ""}>
        Em andamento
      </option>
      <option value="concluida" ${task.status === "concluida" ? "selected" : ""}>
        Concluída
      </option>
    </select>

    <div class="task-actions">
      <button onclick="deleteTask(${task.id})" title="Excluir">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  `;

  return card;
}

/* EDIÇÃO DE TÍTULO / DESCRIÇÃO */
function editTask(id, field, value) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  task[field] = value;
}

/* ATUALIZA STATUS */
function updateStatus(id, status) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  task.status = status;

  if (status === "concluida") {
    task.completedAt = Date.now();
  } else {
    task.completedAt = null;
  }

  renderTasks();
}

/* EXCLUSÃO MANUAL */
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  renderTasks();
}

/* LIMPEZA AUTOMÁTICA (8 DIAS) */
function cleanupCompleted() {
  const now = Date.now();

  tasks = tasks.filter(task =>
    !(
      task.status === "concluida" &&
      task.completedAt &&
      now - task.completedAt > DELETE_AFTER * DAY
    )
  );
}

/* FILTROS POR STATUS */
document.querySelectorAll(".filters button").forEach(button => {
  button.onclick = () => {
    document.querySelector(".filters .active")?.classList.remove("active");
    button.classList.add("active");

    currentFilter = button.dataset.filter;
    renderTasks();
  };
});

/* BUSCA (LIMITADA A 40) */
searchInput.oninput = () => {
  updateLimit(searchInput, 40, searchLimitEl);
  renderTasks();
};

/* NAVEGAÇÃO ENTRE ABAS */
document.querySelectorAll("nav button").forEach(button => {
  button.onclick = () => {
    document.querySelector("nav .active")?.classList.remove("active");
    button.classList.add("active");

    document.querySelector(".tab.active")?.classList.remove("active");
    document.getElementById(button.dataset.tab).classList.add("active");
  };
});

/* LIMITES DE ENTRADA */
titleInput.oninput = () =>
  updateLimit(titleInput, 350, titleLimitEl);

descInput.oninput = () =>
  updateLimit(descInput, 1500, descLimitEl);
