import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
export const STATUS_VALUES = ['a fazer', 'em andamento', 'concluída'];
const Tarefa = sequelize.define('Tarefa', {

  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  titulo: { type: DataTypes.STRING, allowNull: false },

  descricao: { type: DataTypes.TEXT },

  status: { type: DataTypes.ENUM(...STATUS_VALUES), allowNull: false, defaultValue: 'a fazer' }
  
}, { tableName: 'tarefas', timestamps: true });
export default Tarefa;