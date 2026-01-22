import app from './app.js';
import { sequelize } from './models/index.js';
const PORT = process.env.PORT || 3000;
(async()=>{await sequelize.sync();app.listen(PORT,()=>console.log('Rodando em http://localhost:'+PORT));})();
