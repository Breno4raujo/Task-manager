import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import tarefasRouter from './routes/tarefas.js';
import notFound from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandler.js';
import requestLogger from './middlewares/requestLogger.js';
import rateLimiter from './middlewares/rateLimiter.js';
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares básicos //
app.use(express.json());
app.use(requestLogger);
app.use(rateLimiter);

// CORS //
const frontendUrl = process.env.FRONTEND_URL;
if (frontendUrl) {
  app.use(cors({ origin: frontendUrl, credentials: true }));
} else {
  app.use(cors());
}

// Frontend //
app.use(express.static(path.join(__dirname, "..", "public")));

// API
app.use('/tarefas', tarefasRouter);

// Frontend SPA  //
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// 404 //
app.use(notFound);

// Error handler //
app.use(errorHandler);

export default app;
