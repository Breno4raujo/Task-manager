const API_URL = "/tarefas";

const taskList = document.getElementById("task-list");
const form = document.getElementById("task-form");
const skeleton = document.getElementById("skeleton");
const feedback = document.getElementById("feedback");
const statusSelect = document.getElementById("status");

/* abas */
document.querySelectorAll("nav button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(tab => {
      tab.classList.remove("active");
    });

    document.querySelectorAll("nav button").forEach(b => {
      b.classList.remove("active");
    });

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
  const concluida = status === "concluida";

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, concluida })
  });

  if (!res.ok) throw new Error();
}

async function removeTask(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  if (!res.ok) throw new Error();
}

/* render */
function renderTask({ id, titulo, descricao, status }) {
  const card = document.createElement("article");
  card.className = `task-card ${status}`;
  card.dataset.status = status;

  card.innerHTML = `
    <h3>${titulo}</h3>
    <p>${descricao}</p>

    <label class="status-label">Status</label>
    <select class="status-select ${status}">
      <option value="pendente">Pendente</option>
      <option value="andamento">Em andamento</option>
      <option value="concluida">Concluída</option>
    </select>

    <footer>
      <button title="Excluir">🗑</button>
    </footer>
  `;

  const select = card.querySelector("select");
  select.value = status;

  select.addEventListener("change", async e => {
    const newStatus = e.target.value;
    select.className = `status-select ${newStatus}`;
    card.className = `task-card ${newStatus}`;
    card.dataset.status = newStatus;

    try {
      await putTask(id, newStatus);
    } catch {
      showFeedback("Erro ao atualizar status", "error");
    }
  });

  card.querySelector("button").addEventListener("click", async () => {
    card.style.opacity = "0";
    card.style.transform = "scale(0.95)";

    setTimeout(async () => {
      try {
        await removeTask(id);
        loadTasks();
      } catch {
        showFeedback("Erro ao excluir tarefa", "error");
      }
    }, 200);
  });

  taskList.appendChild(card);
}

/* carregar tarefas */
async function loadTasks() {
  skeleton.style.display = "block";
  taskList.innerHTML = "";

  try {
    const tasks = await getTasks();

    if (!Array.isArray(tasks) || tasks.length === 0) {
      taskList.innerHTML = "<p>Nenhuma tarefa encontrada</p>";
      return;
    }

    tasks.forEach(task => {
      if (
        typeof task.id === "number" &&
        task.titulo &&
        task.descricao &&
        task.status
      ) {
        renderTask(task);
      }
    });
  } catch {
    showFeedback("Erro ao carregar tarefas", "error");
  } finally {
    skeleton.style.display = "none";
  }
}

/* criar tarefa */
form.addEventListener("submit", async e => {
  e.preventDefault();

  const titulo = document.getElementById("title").value.trim();
  const descricao = document.getElementById("description").value.trim();
  const status = statusSelect.value;

  if (!titulo || !descricao || !status) {
    showFeedback("Preencha todos os campos", "error");
    return;
  }

  try {
    await postTask({ titulo, descricao, status });
    form.reset();
    statusSelect.className = "status-select pendente";
    showFeedback("Tarefa criada com sucesso");
    loadTasks();
  } catch {
    showFeedback("Erro ao criar tarefa", "error");
  }
});

/* cor do select */
statusSelect.addEventListener("change", () => {
  statusSelect.className = "status-select " + statusSelect.value;
});

/* init */
loadTasks();
