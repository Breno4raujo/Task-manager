import Tarefa from '../models/tarefa.js';
import asyncHandler from '../middlewares/asyncHandler.js';

// Criar
export const criarTarefa = async (req, res) => {
  try {
    const { titulo, descricao, status } = req.body;
    const tarefa = await Tarefa.create({ titulo, descricao, status });
    res.status(201).json(tarefa);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Listar todas
export const listarTarefas = async (req, res) => {
  const tarefas = await Tarefa.findAll();
  res.status(200).json(tarefas);
};

// Buscar por ID
export const buscarTarefaPorId = async (req, res) => {
  const { id } = req.params;
  const tarefa = await Tarefa.findByPk(id);
  if (!tarefa) return res.status(404).json({ message: 'Tarefa não encontrada' });
  res.status(200).json(tarefa);
};

// Atualizar completa
export const atualizarTarefa = async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, status } = req.body;
  const tarefa = await Tarefa.findByPk(id);
  if (!tarefa) return res.status(404).json({ message: 'Tarefa não encontrada' });
  await tarefa.update({ titulo, descricao, status });
  res.status(200).json(tarefa);
};

// Atualizar apenas status
export const atualizarStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const tarefa = await Tarefa.findByPk(id);
  if (!tarefa) return res.status(404).json({ message: 'Tarefa não encontrada' });
  await tarefa.update({ status });
  res.status(200).json(tarefa);
};

// Deletar
export const deletarTarefa = async (req, res) => {
  const { id } = req.params;
  const tarefa = await Tarefa.findByPk(id);
  if (!tarefa) return res.status(404).json({ message: 'Tarefa não encontrada' });
  await tarefa.destroy();
  res.status(204).send();
};
