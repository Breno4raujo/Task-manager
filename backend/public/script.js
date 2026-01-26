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

/* CONSTANTES */
const DAY = 1000 * 60 * 60 * 24;
const DELETE_AFTER = 8;

/* ESTADO */
let tasks = [];
let currentFilter = "todas";

/* FETCH PADRÃO */
async function apiRequest(url, options = {}) {
  const res = await fetch(url, options);
  const contentType = res.headers.get("content-type");

  if (!res.ok) throw new Error("Erro na API");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Resposta inválida da API");
  }

  return res.status !== 204 ? res.json() : null;
}

/* LIMITES */
function updateLimit(input, limit, counterEl) {
  if (!counterEl) return;
  if (input.value.length > limit) input.value = input.value.slice(0, limit);
  counterEl.textContent = `${input.value.length}/${limit}`;
}

/* LOAD */
async function loadTasks() {
  tasks = await apiRequest(API_URL);
  renderTasks();
}

/* CREATE */
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

  alert("Tarefa criada com sucesso");
  clearForm();
  loadTasks();
};

function clearForm() {
  titleInput.value = "";
  descInput.value = "";
  statusSelect.value = "pendente";
  updateLimit(titleInput, 350, titleLimitEl);
  updateLimit(descInput, 1500, descLimitEl);
}

/* RENDER */
function renderTasks() {
  cleanupCompleted();
  taskList.innerHTML = "";

  tasks
    .filter(task =>
      (currentFilter === "todas" || task.status === currentFilter) &&
      task.titulo.toLowerCase().includes(searchInput.value.toLowerCase())
    )
    .forEach(task => taskList.appendChild(createTaskCard(task)));
}

/* CARD */
function createTaskCard(task) {
  const card = document.createElement("div");
  card.className = "task-card";
  card.dataset.id = task.id;
  card.dataset.status = task.status;

  let warning = "";
  if (task.status === "concluida" && task.updatedAt) {
    const daysLeft =
      DELETE_AFTER -
      Math.floor((Date.now() - new Date(task.updatedAt)) / DAY);

    if (daysLeft > 0) {
      warning = `
        <div class="expire-warning">
          Esse card será excluído em ${daysLeft} dia(s)
        </div>`;
    }
  }

  card.innerHTML = `
    ${warning}

    <input class="edit-title" value="${task.titulo}" maxlength="350" readonly />

    <textarea class="edit-desc" maxlength="1500" readonly>
${task.descricao || ""}</textarea>

    <select onchange="updateStatus(${task.id}, this.value)">
      <option value="pendente" ${task.status === "pendente" ? "selected" : ""}>Pendente</option>
      <option value="andamento" ${task.status === "andamento" ? "selected" : ""}>Em andamento</option>
      <option value="concluida" ${task.status === "concluida" ? "selected" : ""}>Concluída</option>
    </select>

    <div class="task-actions" style="display:flex; justify-content:space-between; margin-top:8px;">
      <button onclick="enableEdit(${task.id})" title="Editar">
        <i class="fa-solid fa-pen" style="color:#6a0dad;"></i>
      </button>

      <button onclick="deleteTask(${task.id})" title="Excluir">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  `;

  return card;
}

/* ATIVAR EDIÇÃO */
function enableEdit(id) {
  const card = document.querySelector(`.task-card[data-id="${id}"]`);
  if (!card) return;

  const title = card.querySelector(".edit-title");
  const desc = card.querySelector(".edit-desc");

  title.removeAttribute("readonly");
  desc.removeAttribute("readonly");
  title.focus();

  const icon = card.querySelector(".fa-pen");
  icon.classList.replace("fa-pen", "fa-save");

  icon.parentElement.onclick = () => saveEdit(id);
}

/* SALVAR (COM CONFIRMAÇÃO) */
async function saveEdit(id) {
  if (!confirm("Deseja salvar as alterações?")) return;

  const card = document.querySelector(`.task-card[data-id="${id}"]`);
  if (!card) return;

  const titulo = card.querySelector(".edit-title").value.trim();
  const descricao = card.querySelector(".edit-desc").value.trim();
  const status = card.querySelector("select").value;

  if (!titulo) return alert("O título é obrigatório");

  await apiRequest(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo, descricao, status })
  });

  loadTasks();
}

/* STATUS */
async function updateStatus(id, status) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  task.status = status;

  await apiRequest(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task)
  });

  loadTasks();
}

/* DELETE */
async function deleteTask(id) {
  if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;

  await apiRequest(`${API_URL}/${id}`, { method: "DELETE" });
  alert("Tarefa excluída com sucesso");
  loadTasks();
}

/* AUTO CLEAN */
async function cleanupCompleted() {
  const now = Date.now();

  for (const task of tasks) {
    if (
      task.status === "concluida" &&
      task.updatedAt &&
      now - new Date(task.updatedAt) > DELETE_AFTER * DAY
    ) {
      await apiRequest(`${API_URL}/${task.id}`, { method: "DELETE" });
    }
  }
}

/* FILTROS */
document.querySelectorAll(".filters button").forEach(btn => {
  btn.onclick = () => {
    document.querySelector(".filters .active")?.classList.remove("active");
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  };
});

/* BUSCA */
searchInput.oninput = () => {
  updateLimit(searchInput, 40, searchLimitEl);
  renderTasks();
};

/* TABS */
document.querySelectorAll("nav button").forEach(btn => {
  btn.onclick = () => {
    document.querySelector("nav .active")?.classList.remove("active");
    btn.classList.add("active");

    document.querySelector(".tab.active")?.classList.remove("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  };
});

/* LIMITES */
titleInput.oninput = () => updateLimit(titleInput, 350, titleLimitEl);
descInput.oninput = () => updateLimit(descInput, 1500, descLimitEl);

/* INIT */
loadTasks();

/* EXPOSIÇÃO */
window.enableEdit = enableEdit;
window.updateStatus = updateStatus;
window.deleteTask = deleteTask;
