import express from 'express';
import dotenv from 'dotenv';
import tarefasRouter from './routes/tarefas.js';
import notFound from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandler.js';
import requestLogger from './middlewares/requestLogger.js';
import rateLimiter from './middlewares/rateLimiter.js';


dotenv.config();


const app = express();
app.use(express.json());
app.use(requestLogger);
app.use(rateLimiter);


app.use('/tarefas', tarefasRouter);


// 404
app.use(notFound);

// Error handler
app.use(errorHandler);


export default app;