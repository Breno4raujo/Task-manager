const API_URL = "/tarefas";

const taskList = document.getElementById("task-list");
const form = document.getElementById("task-form");
const skeleton = document.getElementById("skeleton");
const feedback = document.getElementById("feedback");
const statusSelect = document.getElementById("status");

const STATUS_MAP = {
  "pendente": "pendente",
  "em andamento": "andamento",
  "concluída": "concluida"
};

/* abas */
document.querySelectorAll("nav button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(tab =>
      tab.classList.remove("active")
    );

    document.querySelectorAll("nav button").forEach(b =>
      b.classList.remove("active")
    );

    document.getElementById(button.dataset.tab).classList.add("active");
    button.classList.add("active");

    if (button.dataset.tab === "list") {
      loadTasks();
    }
  });
});

/* feedback */
function showFeedback(text, type = "success") {
  feedback.textContent = text;
  feedback.className = type;

  setTimeout(() => {
    feedback.textContent = "";
    feedback.className = "";
  }, 2500);
}

/* api */
async function getTasks() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error();
  return res.json();
}

async function postTask(task) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task)
  });
  if (!res.ok) throw new Error();
}

async function putTask(id, status) {
  const concluida = status === "concluída";

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, concluida })
  });
  if (!res.ok) throw new Error();
}

async function removeTask(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error();
}

/* render */
function renderTask({ id, titulo, descricao, status }) {
  const cssStatus = STATUS_MAP[status];

  const card = document.createElement("article");
  card.className = `task-card ${cssStatus}`;
  card.dataset.status = cssStatus;

  card.innerHTML = `
    <h3>${titulo}</h3>
    <p>${descricao}</p>

    <label class="status-label">Status</label>
    <select class="status-select ${cssStatus}">
      <option value="pendente">Pendente</option>
      <option value="em andamento">Em andamento</option>
      <option value="concluída">Concluída</option>
    </select>

    <footer>
      <button title="Excluir">🗑</button>
    </footer>
  `;

  const select = card.querySelector("select");
  select.value = status;

  select.addEventListener("change", async e => {
    const newStatus = e.target.value;
    const newCssStatus = STATUS_MAP[newStatus];

    select.className = `status-select ${newCssStatus}`;
    card.className = `task-card ${newCssStatus}`;
    card.dataset.status = newCssStatus;

    try {
      await putTask(id, newStatus);
    } catch {
      showFeedback("Erro ao atualizar status", "error");
    }
  });

  card.querySelector("button").addEventListener("click", async () => {
    try {
      await removeTask(id);
      loadTasks();
    } catch {
      showFeedback("Erro ao excluir tarefa", "error");
    }
  });

  taskList.appendChild(card);
}

/* carregar tarefas */
async function loadTasks() {
  skeleton.style.display = "block";
  taskList.innerHTML = "";

  try {
    const tasks = await getTasks();

    if (!tasks.length) {
      taskList.innerHTML = "<p>Nenhuma tarefa encontrada</p>";
      return;
    }

    tasks.forEach(renderTask);
    document.getElementById("task-counter").textContent =
      `${tasks.length} tarefas`;
  } catch {
    showFeedback("Erro ao carregar tarefas", "error");
  } finally {
    skeleton.style.display = "none";
  }
}

/* criar tarefa */
form.addEventListener("submit", async e => {
  e.preventDefault();

  const titulo = title.value.trim();
  const descricao = description.value.trim();
  const status = statusSelect.value;

  if (!titulo || !descricao || !status) {
    showFeedback("Preencha todos os campos", "error");
    return;
  }

  try {
    await postTask({ titulo, descricao, status });
    form.reset();
    statusSelect.value = "pendente";
    statusSelect.className = "status-select pendente";
    showFeedback("Tarefa criada com sucesso");
    loadTasks();
  } catch {
    showFeedback("Erro ao criar tarefa", "error");
  }
});

/* cor do select criar */
statusSelect.addEventListener("change", () => {
  statusSelect.className =
    "status-select " + STATUS_MAP[statusSelect.value];
});

/* init */
loadTasks();
