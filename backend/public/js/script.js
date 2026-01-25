const API_URL = "/tarefas";
let selectedStatus = "pendente";

/* SELECT CUSTOM */
const select = document.getElementById("status-select");
const selected = select.querySelector(".select-selected");
const options = select.querySelector(".select-options");

selected.addEventListener("click", () => {
  options.style.display =
    options.style.display === "block" ? "none" : "block";
});

options.querySelectorAll("div").forEach(option => {
  option.addEventListener("click", () => {
    selected.textContent = option.textContent;
    selected.className = `select-selected ${option.classList[0]}`;
    selectedStatus = option.dataset.value;
    options.style.display = "none";
  });
});

/* FECHAR AO CLICAR FORA */
document.addEventListener("click", e => {
  if (!select.contains(e.target)) {
    options.style.display = "none";
  }
});

/* FORM */
const form = document.getElementById("task-form");
const list = document.getElementById("task-list");

form.addEventListener("submit", async e => {
  e.preventDefault();

  const titulo = title.value.trim();
  const descricao = description.value.trim();

  if (!titulo || !descricao) return;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titulo,
      descricao,
      status: selectedStatus
    })
  });

  form.reset();
  selected.textContent = "Pendente";
  selected.className = "select-selected pendente";
  selectedStatus = "pendente";

  loadTasks();
});

/* TASKS */

async function loadTasks() {
  list.innerHTML = "";
  const res = await fetch(API_URL);
  const tasks = await res.json();

  tasks.forEach(t => {
    const card = document.createElement("div");
    card.className = `task ${mapStatus(t.status)}`;
    card.innerHTML = `<strong>${t.titulo}</strong><p>${t.descricao}</p>`;
    list.appendChild(card);
  });
}

function mapStatus(status) {
  if (status === "pendente") return "pendente";
  if (status === "em andamento") return "andamento";
  return "concluida";
}

loadTasks();
