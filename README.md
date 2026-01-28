📝 Task Manager (API + Frontend)

Aplicação full stack para gerenciamento de tarefas (To-Do List), composta por uma API REST robusta e uma interface web moderna e responsiva, desenvolvida para consolidar conceitos de frontend e backend, consumo de APIs e boas práticas de arquitetura.

Projeto desenvolvido durante o programa Programadores do Amanhã, integrando os aprendizados dos módulos M2 (Backend) e M3 (Frontend).

🌐 Visão Geral do Projeto

🔙 Backend: API REST em Node.js seguindo padrão MVC

🎨 Frontend: Interface web responsiva consumindo a API em tempo real

🔗 Integração completa entre frontend e backend

🚀 Deploy em produção

🚀 Tecnologias Utilizadas
Backend

Node.js

Express

Sequelize ORM

SQLite

Dotenv

Nodemon

Sequelize CLI

Arquitetura MVC

Swagger (documentação)

Frontend

HTML5 Semântico

CSS3

Flexbox

CSS Grid

Media Queries

Animações e gradientes

JavaScript ES6+

Fetch API

Manipulação do DOM

Design Mobile-First

Notificações visuais (toasts)

📂 Estrutura do Projeto
src/
├─ config/        # Configuração do banco de dados (Sequelize)
├─ controllers/   # Lógica de negócio (CRUD de tarefas)
├─ middlewares/   # Logs, validações, erros e limites de requisição
├─ models/        # Models Sequelize
├─ routes/        # Rotas da API
├─ migrations/    # Migrations (opcional)
├─ app.js         # Configuração do Express
└─ server.js      # Inicialização do servidor

public/
├─ index.html     # Interface principal
├─ style.css      # Estilos (Mobile-First)
└─ script.js      # Lógica frontend e consumo da API

⚙️ Configuração do Ambiente (Backend)
1️⃣ Clone o repositório
git clone https://github.com/Breno4raujo/API-Tarefas.git
cd api-tarefas

2️⃣ Instale as dependências
npm install

3️⃣ Configure o arquivo .env

Crie um arquivo .env na raiz do projeto:

NODE_ENV=development
DATABASE_URL=sqlite:./database.sqlite
PORT=3000

4️⃣ Inicie o servidor
npm run dev
# ou
npm start


📍 A API estará disponível em:
👉 http://localhost:3000

🧩 Endpoints da API
Método	Endpoint	Descrição
POST	/tarefas	Criar nova tarefa
GET	/tarefas	Listar todas as tarefas
GET	/tarefas/:id	Buscar tarefa por ID
PUT	/tarefas/:id	Atualizar tarefa
PATCH	/tarefas/:id/status	Atualizar status
DELETE	/tarefas/:id	Remover tarefa
✅ Exemplos de Uso (JSON)
Criar tarefa
{
  "titulo": "Estudar Node.js",
  "descricao": "Finalizar módulo de Express",
  "status": "pendente"
}

Atualizar tarefa
{
  "titulo": "Estudar Sequelize",
  "descricao": "Praticar migrations",
  "status": "andamento"
}

Atualizar status
{
  "status": "concluida"
}

🖥️ Frontend (Interface Web)

O frontend consome a API REST utilizando Fetch API, sem frameworks, garantindo performance e clareza de código.

Funcionalidades da Interface:

Criar tarefas

Editar tarefas (inline)

Cancelar edição

Atualizar status

Excluir tarefas

Filtros dinâmicos por status

Busca por título

Notificações visuais em tempo real

Atualização dinâmica sem recarregar a página

Layout responsivo (mobile, tablet e desktop)

📁 Localizado na pasta public/, servido automaticamente pelo Express.

🌍 Deploy

Backend: Render

Frontend: Servido pelo próprio backend ou via GitHub Pages

A aplicação está disponível online em ambiente de produção.

⚠️ Validações e Tratamento de Erros
🔍 Validações automáticas

titulo obrigatório

status permitido:

pendente

andamento

concluida

⚙️ Middlewares
Middleware	Função
requestLogger	Log das requisições
rateLimiter	Limite de requisições
validateTarefa	Validação de dados
errorHandler	Erros padronizados
notFound	Rotas inexistentes
🧪 Testes com Postman

O projeto inclui uma collection pronta:

Abra o Postman

File → Import

Selecione postman_collection.json

Execute os endpoints 🎯

📘 Scripts Disponíveis
Comando	Descrição
npm run dev	Servidor com Nodemon
npm start	Servidor em produção
npx sequelize-cli db:migrate	Executar migrations
🧱 Banco de Dados

Banco SQLite gerado automaticamente (database.sqlite)

Ferramentas recomendadas:

DB Browser for SQLite

Beekeeper Studio

🧰 .gitignore
node_modules/
.env
logs/
*.sqlite
*.db
uploads/
.vscode/
.idea/

📜 Licença

Este projeto é open-source e licenciado sob a MIT License.

👨‍💻 Autor

Breno Araujo Melo
📧 Email: devbrenoaraujo@gmail.com

💼 LinkedIn: https://www.linkedin.com/in/brenoaraujodev/
