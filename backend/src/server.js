import app from './app.js';
import { sequelize } from './models/index.js';

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await sequelize.sync();

        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });

    } catch (error) {
        console.error('Erro ao iniciar o servidor:', error);
    }
}

startServer();

