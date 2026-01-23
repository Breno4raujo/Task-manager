const API_URL = "/tarefas";

const taskList = document.getElementById("task-list");
const form = document.getElementById("task-form");
const skeleton = document.getElementById("skeleton");
const feedback = document.getElementById("feedback");

/* ABAS */
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

/* FEEDBACK */
function showFeedback(text, type = "success") {
  feedback.textContent = text;
  feedback.className = type;

  setTimeout(() => {
    feedback.textContent = "";
    feedback.className = "";
  }, 2500);
}

/* API */
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

async function putTask(id, concluida) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ concluida })
  });
  if (!res.ok) throw new Error();
}

async function removeTask(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error();
}

/* RENDER */
function renderTask({ id, titulo, descricao, concluida }) {
  const card = document.createElement("article");
  card.className = "task-card";
  if (concluida) card.classList.add("completed");

  card.innerHTML = `
    <h3>${titulo}</h3>
    <p>${descricao}</p>

    <div class="task-actions">
      <label>
        <input type="checkbox" ${concluida ? "checked" : ""} />
        Concluída
      </label>
      <button>🗑</button>
    </div>
  `;

  // Concluir tarefa
  card.querySelector("input").addEventListener("change", async e => {
    try {
      await putTask(id, e.target.checked);
      loadTasks();
    } catch {
      showFeedback("Erro ao atualizar tarefa", "error");
    }
  });

  // Excluir tarefa
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

/* LOAD */
async function loadTasks() {
  skeleton.style.display = "grid";
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
        "titulo" in task &&
        "descricao" in task &&
        "concluida" in task
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

/* CREATE*/
form.addEventListener("submit", async e => {
  e.preventDefault();

  const titulo = document.getElementById("title").value.trim();
  const descricao = document.getElementById("description").value.trim();

  if (!titulo || !descricao) {
    showFeedback("Preencha todos os campos", "error");
    return;
  }

  try {
    await postTask({ titulo, descricao });
    form.reset();
    showFeedback("Tarefa criada com sucesso");
    loadTasks();
  } catch {
    showFeedback("Erro ao criar tarefa", "error");
  }
});

/* INIT */
loadTasks();
