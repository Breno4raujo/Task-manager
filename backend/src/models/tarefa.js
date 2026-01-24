import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
export const STATUS_VALUES = ['pendente', 'em andamento', 'concluída'];
const Tarefa = sequelize.define('Tarefa', {

  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  titulo: { type: DataTypes.STRING, allowNull: false },

  descricao: { type: DataTypes.TEXT },

  status: { type: DataTypes.ENUM(...STATUS_VALUES), allowNull: false, defaultValue: 'pendente' }
  
}, { tableName: 'tarefas', timestamps: true });
export default Tarefa;