const API_URL = "https://api-tarefas-4slt.onrender.com/tarefas";

/* REFERÊNCIAS DO DOM */
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

/* FUNÇÃO FETCH PADRÃO */
async function apiRequest(url, options = {}) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error("Erro na API");
    return res.status !== 204 ? res.json() : null;
  } catch (err) {
    alert("Erro de conexão com a API");
    throw err;
  }
}

/* CONTADOR DE CARACTERES */
function updateLimit(input, limit, counterEl) {
  if (!counterEl) return;

  if (input.value.length > limit) {
    input.value = input.value.slice(0, limit);
  }
  counterEl.textContent = `${input.value.length}/${limit}`;
}

/* CARREGAR TAREFAS (GET) */
async function loadTasks() {
  tasks = await apiRequest(API_URL);
  renderTasks();
}

/* CRIAR NOVA TAREFA (POST) */
addTaskBtn.onclick = async () => {
  if (!titleInput.value.trim()) return;

  await apiRequest(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titulo: titleInput.value.trim(),
      descricao: descInput.value.trim(),
      status: statusSelect.value
    })
  });

  clearForm();
  loadTasks();
};

/* LIMPAR FORMULÁRIO*/
function clearForm() {
  titleInput.value = "";
  descInput.value = "";
  statusSelect.value = "pendente";

  updateLimit(titleInput, 350, titleLimitEl);
  updateLimit(descInput, 1500, descLimitEl);
}

/* RENDERIZAÇÃO PRINCIPAL */
function renderTasks() {
  cleanupCompleted();
  taskList.innerHTML = "";

  tasks
    .filter(task =>
      (currentFilter === "todas" || task.status === currentFilter) &&
      task.titulo.toLowerCase().includes(searchInput.value.toLowerCase())
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
  if (task.status === "concluida" && task.updatedAt) {
    const daysLeft =
      DELETE_AFTER -
      Math.floor((Date.now() - new Date(task.updatedAt).getTime()) / DAY);

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
      value="${task.titulo}"
      oninput="editTask(${task.id}, 'titulo', this.value)"
    />

    <textarea
      class="edit-desc"
      maxlength="1500"
      oninput="editTask(${task.id}, 'descricao', this.value)"
    >${task.descricao || ""}</textarea>

    <select onchange="updateStatus(${task.id}, this.value)">
      <option value="pendente" ${task.status === "pendente" ? "selected" : ""}>Pendente</option>
      <option value="andamento" ${task.status === "andamento" ? "selected" : ""}>Em andamento</option>
      <option value="concluida" ${task.status === "concluida" ? "selected" : ""}>Concluída</option>
    </select>

    <div class="task-actions">
      <button onclick="deleteTask(${task.id})" title="Excluir">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  `;

  return card;
}

/* EDIÇÃO INLINE (PUT) */
async function editTask(id, field, value) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  task[field] = value;

  await apiRequest(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titulo: task.titulo,
      descricao: task.descricao,
      status: task.status
    })
  });
}

/* ATUALIZA STATUS (PATCH)*/
async function updateStatus(id, status) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  task.status = status;

  await apiRequest(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titulo: task.titulo,
      descricao: task.descricao,
      status: task.status
    })
  });

  loadTasks();
}

/* EXCLUSÃO MANUAL (DELETE) */
async function deleteTask(id) {
  await apiRequest(`${API_URL}/${id}`, { method: "DELETE" });
  loadTasks();
}

/* LIMPEZA AUTOMÁTICA (8 DIAS) */
async function cleanupCompleted() {
  const now = Date.now();

  for (const task of tasks) {
    if (
      task.status === "concluida" &&
      task.updatedAt &&
      now - new Date(task.updatedAt).getTime() > DELETE_AFTER * DAY
    ) {
      await apiRequest(`${API_URL}/${task.id}`, { method: "DELETE" });
    }
  }
}

/* FILTROS */
document.querySelectorAll(".filters button").forEach(button => {
  button.onclick = () => {
    document.querySelector(".filters .active")?.classList.remove("active");
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderTasks();
  };
});

/* BUSCA */
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

/* LIMITES */
titleInput.oninput = () => updateLimit(titleInput, 350, titleLimitEl);
descInput.oninput = () => updateLimit(descInput, 1500, descLimitEl);

/* INIT*/
loadTasks();
