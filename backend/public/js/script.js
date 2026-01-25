const API_URL = "https://api-tarefas.onrender.com/tarefas";

// Mapeia status do backend para classes CSS //
const STATUS_MAP = {
  "pendente": "pendente",
  "em andamento": "andamento",
  "concluída": "concluida"
};

// Elementos //
const form = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const descInput = document.getElementById("description");
const statusSelect = document.getElementById("status");
const taskList = document.getElementById("task-list");
const counter = document.getElementById("counter");

// Filtros //
const filterButtons = document.querySelectorAll(".filters button");


// BUSCAR TAREFAS //
async function fetchTasks() {
  taskList.innerHTML = "";
  const response = await fetch(API_URL);
  const tasks = await response.json();

  tasks.forEach(renderTask);
  updateCounter();
}

// RENDERIZAR CARD //
function renderTask(task) {
  const { id, titulo, descricao, status } = task;
  const cssStatus = STATUS_MAP[status];

  const card = document.createElement("article");
  card.className = `task-card ${cssStatus}`;
  card.dataset.status = cssStatus;

  card.innerHTML = `
    <h3>${titulo}</h3>
    <p>${descricao}</p>

    <label>Status</label>
    <select class="status-select ${cssStatus}">
      <option value="pendente" ${status === "pendente" ? "selected" : ""}>Pendente</option>
      <option value="em andamento" ${status === "em andamento" ? "selected" : ""}>Em andamento</option>
      <option value="concluída" ${status === "concluída" ? "selected" : ""}>Concluída</option>
    </select>

    <footer>
      <button class="delete-btn">🗑</button>
    </footer>
  `;

  // Atualizar status //
  const select = card.querySelector("select");
  select.addEventListener("change", async () => {
    const newStatus = select.value;
    const newCss = STATUS_MAP[newStatus];

    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });

    card.className = `task-card ${newCss}`;
    card.dataset.status = newCss;
    select.className = `status-select ${newCss}`;
  });

  // Excluir tarefa //
  card.querySelector(".delete-btn").addEventListener("click", async () => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    card.remove();
    updateCounter();
  });

  taskList.appendChild(card);
}

// CRIAR TAREFA //
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newTask = {
    titulo: titleInput.value,
    descricao: descInput.value,
    status: statusSelect.value
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTask)
  });

  form.reset();
  fetchTasks();
});

// CONTADOR //
function updateCounter() {
  const total = document.querySelectorAll(".task-card").length;
  counter.textContent = `${total} tarefas`;
}


// FILTROS //
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;
    applyFilter(filter);
  });
});

function applyFilter(filter) {
  const cards = document.querySelectorAll(".task-card");

  cards.forEach(card => {
    if (filter === "all") {
      card.style.display = "block";
    } else {
      card.style.display =
        card.dataset.status === filter ? "block" : "none";
    }
  });
}

// Inicialização
fetchTasks();
