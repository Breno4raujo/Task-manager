# 📝 API de Tarefas

API REST completa para **gerenciar uma lista de tarefas**, construída com **Node.js**, **Express**, **Sequelize** e **SQLite**, seguindo o padrão **MVC** e boas práticas de arquitetura, organização e tratamento de erros.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** — Ambiente de execução JavaScript
- **Express** — Framework para criação de rotas e servidor HTTP
- **Sequelize ORM** — Mapeamento objeto-relacional com suporte a SQLite
- **SQLite** — Banco de dados leve e local
- **Dotenv** — Gerenciamento de variáveis de ambiente
- **Nodemon** — Monitoramento automático durante o desenvolvimento
- **Sequelize CLI** — Gerenciamento de migrations e models

---

## 📂 Estrutura do Projeto

src/
├─ config/ # Configuração do banco de dados (Sequelize)
├─ controllers/ # Lógica de negócio (CRUD de tarefas)
├─ middlewares/ # Logs, validações, erros e limites de requisição
├─ models/ # Modelos Sequelize (ORM)
├─ routes/ # Definição das rotas da API
├─ migrations/ # Migrations (opcional com sequelize-cli)
├─ app.js # Configuração principal do Express
└─ server.js # Inicialização do servidor

---

## ⚙️ Configuração do Ambiente

1️⃣ Clone o repositório

git clone https://github.com/Breno4raujo/API-Tarefas.git
cd api-tarefas

2️⃣ Instale as dependências

npm install

3️⃣ Crie o arquivo .env
Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:

NODE_ENV=development

DATABASE_URL=sqlite:./database.sqlite

PORT=3000

4️⃣ Inicie o servidor

npm run dev
ou
npm start

---

## A API estará disponível em:
👉 http://localhost:3000

---

## 🧩 Endpoints da API
Método	Endpoint	Descrição
POST	/tarefas	Criar uma nova tarefa
GET	/tarefas	Listar todas as tarefas
GET	/tarefas/:id	Buscar uma tarefa por ID
PUT	/tarefas/:id	Atualizar todos os dados de uma tarefa
PATCH	/tarefas/:id/status	Atualizar apenas o status da tarefa
DELETE	/tarefas/:id	Remover uma tarefa existente

---

## ✅ Exemplos de Uso (JSON)
Criar uma Tarefa — POST /tarefas

{
  "titulo": "Estudar Node.js",
  "descricao": "Finalizar o módulo de Express",
  "status": "a fazer"
}
Atualizar uma Tarefa — PUT /tarefas/:id


{
  "titulo": "Estudar Sequelize",
  "descricao": "Praticar migrations e relacionamentos",
  "status": "em andamento"
}
Atualizar Status — PATCH /tarefas/:id/status


{
  "status": "concluída"
}

---

## ⚠️ Validações e Tratamento de Erros
A API possui middlewares inteligentes para garantir a integridade dos dados e segurança das requisições:

---

## 🔍 Validações automáticas (validateTarefa.js)
titulo é obrigatório e não pode estar vazio.

status deve ser um dos valores permitidos: "a fazer", "em andamento", "concluída".

---

## ⚙️ Middlewares incluídos
Middleware	Função
requestLogger	Exibe no console detalhes das requisições e tempo de resposta
rateLimiter	Limita o número de requisições por IP
validateTarefa	Valida os campos titulo, descricao e status
errorHandler	Retorna erros personalizados em formato JSON
notFound	Lida com rotas inexistentes (404)

---

## 🧪 Testando com Postman
O projeto inclui um arquivo postman_collection.json com todos os endpoints configurados.

Abra o Postman

Vá em File > Import

Selecione o arquivo postman_collection.json

Execute as requisições e veja os retornos da API 🎯

---

## 📘 Scripts Disponíveis
Comando	Descrição
npm run dev	Inicia o servidor com Nodemon
npm start	Inicia o servidor normalmente
npx sequelize-cli db:migrate	Executa migrations (opcional)

---

## 🧱 Banco de Dados
O Sequelize criará automaticamente o arquivo database.sqlite na raiz do projeto.
Você pode inspecionar os dados utilizando ferramentas como:

DB Browser for SQLite

Beekeeper Studio

---

## 🧰 .gitignore
O projeto inclui um .gitignore configurado para ignorar arquivos sensíveis e diretórios desnecessários:

node_modules/
.env
logs/
*.sqlite
*.db
uploads/
.vscode/
.idea/

---

📜 Licença
Este projeto é open-source e está sob a licença MIT.

---

## 👨‍💻 Autor
Breno Araujo Melo
📧 E-mail: devbrenoaraujo@gmail.com
💼 LinkedIn: https://www.linkedin.com/in/brenoaraujodev/
