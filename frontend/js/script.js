const API_URL = 'http://localhost:3000/tarefas';

const taskList = document.getElementById('task-list');
const form = document.getElementById('task-form');
const skeleton = document.getElementById('skeleton');
const feedback = document.getElementById('feedback');

document.querySelectorAll('nav button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

async function loadTasks() {
  skeleton.style.display = 'grid';
  taskList.innerHTML = '';
  feedback.textContent = '';

  try {
    const res = await fetch(API_URL);
    const tasks = await res.json();
    skeleton.style.display = 'none';
    tasks.forEach(renderTask);
  } catch {
    skeleton.style.display = 'none';
    feedback.textContent = 'Erro ao conectar com a API';
  }
}

function renderTask(task) {
  const article = document.createElement('article');
  if (task.concluida) article.classList.add('completed');

  article.innerHTML = `
    <h3>${task.titulo}</h3>
    <p>${task.descricao}</p>
    <label>
      <input type="checkbox" ${task.concluida ? 'checked' : ''}/> Concluída
    </label>
    <button>Excluir</button>
  `;

  article.querySelector('input').addEventListener('change', e =>
    updateTask(task.id, e.target.checked)
  );

  article.querySelector('button').addEventListener('click', () =>
    deleteTask(task.id)
  );

  taskList.appendChild(article);
}

form.addEventListener('submit', async e => {
  e.preventDefault();

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      titulo: title.value,
      descricao: description.value
    })
  });

  form.reset();
  loadTasks();
});

async function updateTask(id, concluida) {
  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ concluida })
  });
}

async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  loadTasks();
}

loadTasks();
