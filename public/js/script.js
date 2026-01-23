const API_URL = "https://api-tarefas-4slt.onrender.com/tarefas";

const taskList = document.getElementById("task-list");
const form = document.getElementById("task-form");
const skeleton = document.getElementById("skeleton");
const feedback = document.getElementById("feedback");

/* ABAS */
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
  });
});

/* FEEDBACK */
function showFeedback(message, type = "success") {
  feedback.textContent = message;
  feedback.className = type;

  setTimeout(() => {
    feedback.textContent = "";
  }, 2000);
}

/* API */
async function fetchTasks() {
  const res = await fetch(API_URL);
  return res.json();
}

async function createTask(data) {
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

async function updateTask(id, concluida) {
  return fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ concluida })
  });
}

async function deleteTask(id) {
  return fetch(`${API_URL}/${id}`, { method: "DELETE" });
}

/* RENDER */
function renderTask(task) {
  const article = document.createElement("article");
  if (task.concluida) article.classList.add("completed");

  article.innerHTML = `
    <h3>${task.titulo}</h3>
    <p>${task.descricao}</p>
    <label>
      <input type="checkbox" ${task.concluida ? "checked" : ""}/> Concluída
    </label>
    <button>🗑 Excluir</button>
  `;

  article.querySelector("input").addEventListener("change", e =>
    updateTask(task.id, e.target.checked)
  );

  article.querySelector("button").addEventListener("click", async () => {
    article.style.opacity = "0";
    article.style.transform = "scale(0.95)";

    setTimeout(async () => {
      await deleteTask(task.id);
      loadTasks();
    }, 200);
  });

  taskList.appendChild(article);
}

/* CONTROLE */
async function loadTasks() {
  skeleton.style.display = "block";
  taskList.innerHTML = "";

  try {
    const tasks = await fetchTasks();
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

  await createTask({
    titulo: title.value,
    descricao: description.value
  });

  showFeedback("✅ Tarefa adicionada!");
  form.reset();
  loadTasks();
});

/* INIT */
loadTasks();
