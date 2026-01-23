const API_URL = "/tarefas";

const taskList = document.getElementById("task-list");
const form = document.getElementById("task-form");
const skeleton = document.getElementById("skeleton");
const feedback = document.getElementById("feedback");

/* NAVEGAÇÃO ENTRE ABAS */
document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(tab =>
      tab.classList.remove("active")
    );

    document.querySelectorAll("nav button").forEach(b =>
      b.classList.remove("active")
    );

    document.getElementById(btn.dataset.tab).classList.add("active");
    btn.classList.add("active");

    if (btn.dataset.tab === "list") {
      loadTasks();
    }
  });
});

/* FEEDBACK VISUAL */
function showFeedback(message, type = "success") {
  feedback.textContent = message;
  feedback.className = type;

  setTimeout(() => {
    feedback.textContent = "";
    feedback.className = "";
  }, 2000);
}

/* API */
async function fetchTasks() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Erro ao buscar tarefas");
  return res.json();
}

async function createTask(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error("Erro ao criar tarefa");
}

async function updateTask(id, concluida) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ concluida })
  });

  if (!res.ok) throw new Error("Erro ao atualizar tarefa");
}

async function deleteTask(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  if (!res.ok) throw new Error("Erro ao deletar tarefa");
}

/* RENDERIZAÇÃO */
function renderTask(task) {
  const article = document.createElement("article");
  article.className = "task-card";

  if (task.concluida) {
    article.classList.add("completed");
  }

  article.innerHTML = `
    <h3>${task.titulo}</h3>
    <p>${task.descricao}</p>

    <div class="task-actions">
      <label>
        <input type="checkbox" ${task.concluida ? "checked" : ""} />
        Concluída
      </label>
      <button title="Excluir tarefa">🗑</button>
    </div>
  `;

  // Atualizar status
  article.querySelector("input").addEventListener("change", async e => {
    try {
      await updateTask(task.id, e.target.checked);
      loadTasks();
    } catch {
      showFeedback("Erro ao atualizar tarefa", "error");
    }
  });

  // Excluir tarefa
  article.querySelector("button").addEventListener("click", async () => {
    article.style.opacity = "0";
    article.style.transform = "scale(0.95)";

    setTimeout(async () => {
      try {
        await deleteTask(task.id);
        loadTasks();
      } catch {
        showFeedback("Erro ao deletar tarefa", "error");
      }
    }, 200);
  });

  taskList.appendChild(article);
}

/* CONTROLE DE TAREFAS*/
async function loadTasks() {
  skeleton.style.display = "grid";
  taskList.innerHTML = "";
  feedback.textContent = "";

  try {
    const tasks = await fetchTasks();

    if (tasks.length === 0) {
      taskList.innerHTML = "<p>Nenhuma tarefa cadastrada</p>";
      return;
    }

    tasks.forEach(renderTask);
  } catch {
    showFeedback("Erro ao conectar com a API", "error");
  } finally {
    skeleton.style.display = "none";
  }
}

/* EVENTOS */
form.addEventListener("submit", async e => {
  e.preventDefault();

  try {
    await createTask({
      titulo: title.value,
      descricao: description.value
    });

    showFeedback("✅ Tarefa adicionada!");
    form.reset();
    loadTasks();
  } catch {
    showFeedback("Erro ao adicionar tarefa", "error");
  }
});

/* INIT */
loadTasks();
