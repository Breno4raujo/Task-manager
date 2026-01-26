import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Tarefa = sequelize.define("Tarefa", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  titulo: {
    type: DataTypes.STRING(350),
    allowNull: false
  },

  descricao: {
    type: DataTypes.STRING(1500),
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM("pendente", "andamento", "concluida"),
    allowNull: false,
    defaultValue: "pendente"
  },

  concluida: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },

  concluidaEm: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

export default Tarefa;
