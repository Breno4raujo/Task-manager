const API_URL = "https://api-tarefas-4slt.onrender.com/tarefas";

/* DOM */
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

/* TOAST */
function toast(message, time = 2500) {
  const overlay = document.createElement("div");
  overlay.className = "toast-overlay";

  const box = document.createElement("div");
  box.className = "toast";
  box.textContent = message;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  setTimeout(() => overlay.remove(), time);
}

function toastConfirm(message, onConfirm, onCancel) {
  const overlay = document.createElement("div");
  overlay.className = "toast-overlay";

  const box = document.createElement("div");
  box.className = "toast";

  const text = document.createElement("div");
  text.textContent = message;

  const actions = document.createElement("div");
  actions.className = "toast-actions";

  const yes = document.createElement("button");
  yes.textContent = "Sim";

  const no = document.createElement("button");
  no.textContent = "Cancelar";
  no.className = "cancel";

  yes.onclick = () => {
    onConfirm?.();
    overlay.remove();
  };

  no.onclick = () => {
    onCancel?.();
    overlay.remove();
  };

  actions.appendChild(yes);
  actions.appendChild(no);

  box.appendChild(text);
  box.appendChild(actions);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

/* FETCH */
async function apiRequest(url, options = {}) {
  const res = await fetch(url, options);
  const contentType = res.headers.get("content-type");

  if (!res.ok) throw new Error("Erro na API");

  // Permitir 204 No Content sem lançar erro
  if (res.status === 204) return null;

  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Resposta inválida da API");
  }

  return res.json();
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
  await cleanupCompleted(); //  LIMPA ANTES DE RENDERIZAR
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

  toast("Tarefa criada com sucesso");
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

/* RENDER (PURO) */
function renderTasks() {
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

  card.innerHTML = `
    <input class="edit-title" value="${task.titulo}" maxlength="350" readonly />

    <textarea class="edit-desc" maxlength="1500" readonly>${task.descricao || ""}</textarea>

    <select onchange="updateStatus(${task.id}, this.value)">
      <option value="pendente" ${task.status === "pendente" ? "selected" : ""}>Pendente</option>
      <option value="andamento" ${task.status === "andamento" ? "selected" : ""}>Em andamento</option>
      <option value="concluida" ${task.status === "concluida" ? "selected" : ""}>Concluída</option>
    </select>

    <div class="task-actions" style="display:flex; justify-content:space-between; margin-top:8px;">
      <button onclick="enableEdit(${task.id}, this)">
        <i class="fa-solid fa-pen" style="color:#6a0dad;"></i>
      </button>

      <button onclick="deleteTask(${task.id})">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  `;
  return card;
}

/* EDIT */
function enableEdit(id, btn) {
  const card = document.querySelector(`.task-card[data-id="${id}"]`);
  if (!card) return;

  const title = card.querySelector(".edit-title");
  const desc = card.querySelector(".edit-desc");
  const icon = btn.querySelector("i");

  if (icon.classList.contains("fa-save")) {
    toastConfirm("Deseja salvar as alterações?", () => saveEdit(id), () => {
      title.value = title.dataset.original;
      desc.value = desc.dataset.original;
      title.setAttribute("readonly", true);
      desc.setAttribute("readonly", true);
      icon.classList.replace("fa-save", "fa-pen");
    });
    return;
  }

  title.dataset.original = title.value;
  desc.dataset.original = desc.value;

  title.removeAttribute("readonly");
  desc.removeAttribute("readonly");
  title.focus();

  icon.classList.replace("fa-pen", "fa-save");
}

/* SAVE */
async function saveEdit(id) {
  const card = document.querySelector(`.task-card[data-id="${id}"]`);
  if (!card) return;

  const titulo = card.querySelector(".edit-title").value.trim();
  const descricao = card.querySelector(".edit-desc").value.trim();
  const status = card.querySelector("select").value;

  if (!titulo) return;

  await apiRequest(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo, descricao, status })
  });

  toast("Tarefa salva");
  loadTasks();
}

/* STATUS */
async function updateStatus(id, status) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  await apiRequest(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...task, status })
  });

  loadTasks();
}

/* DELETE */
function deleteTask(id) {
  const card = document.querySelector(`.task-card[data-id="${id}"]`);
  if (!card) return;

  toastConfirm("Tem certeza que deseja excluir esta tarefa?", async () => {
    const taskToDelete = tasks.find(t => t.id === id);

    card.remove();

    tasks = tasks.filter(t => t.id !== id);

    toast("Tarefa excluída com sucesso");

    try {
      await apiRequest(`${API_URL}/${id}`, { method: "DELETE" });
    } catch (err) {
      toast("Erro ao excluir tarefa na API");
      console.error(err);
      if (taskToDelete) {
        tasks.push(taskToDelete);
        renderTasks();
      }
    }
  });
}


/* AUTO CLEAN */
async function cleanupCompleted() {
  const now = Date.now();
  const expired = tasks.filter(
    t =>
      t.status === "concluida" &&
      t.updatedAt &&
      now - new Date(t.updatedAt) > DELETE_AFTER * DAY
  );

  for (const task of expired) {
    await apiRequest(`${API_URL}/${task.id}`, { method: "DELETE" });
  }

  if (expired.length) {
    tasks = tasks.filter(t => !expired.includes(t));
  }
}

/* UI */
document.querySelectorAll(".filters button").forEach(btn => {
  btn.onclick = () => {
    document.querySelector(".filters .active")?.classList.remove("active");
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  };
});

searchInput.oninput = () => {
  updateLimit(searchInput, 40, searchLimitEl);
  renderTasks();
};

document.querySelectorAll("nav button").forEach(btn => {
  btn.onclick = () => {
    document.querySelector("nav .active")?.classList.remove("active");
    btn.classList.add("active");

    document.querySelector(".tab.active")?.classList.remove("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  };
});

titleInput.oninput = () => updateLimit(titleInput, 350, titleLimitEl);
descInput.oninput = () => updateLimit(descInput, 1500, descLimitEl);

/* INIT */
loadTasks();

/* GLOBAL */
window.enableEdit = enableEdit;
window.updateStatus = updateStatus;
window.deleteTask = deleteTask;
