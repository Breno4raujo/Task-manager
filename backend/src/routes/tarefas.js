import { Router } from "express";
import { Tarefa } from "../models/tarefa.js";

const router = Router();

// Lista todas
router.get("/", async (req, res, next) => {
  try {
    const tarefas = await Tarefa.findAll();
    res.json(tarefas);
  } catch (error) {
    next(error);
  }
});

// Buscar por ID
router.get("/:id", async (req, res, next) => {
  try {
    const tarefa = await Tarefa.findByPk(req.params.id);
    if (!tarefa) return res.status(404).json({ mensagem: "Não encontrada" });
    res.json(tarefa);
  } catch (error) {
    next(error);
  }
});

// Criar nova tarefa
router.post("/", async (req, res, next) => {
  try {
    const { titulo, descricao, status } = req.body;

    // Ajusta campos de conclusão
    const concluida = status === "concluida";
    const concluidaEm = concluida ? new Date() : null;

    const nova = await Tarefa.create({
      titulo,
      descricao,
      status,
      concluida,
      concluidaEm
    });

    res.status(201).json(nova);
  } catch (error) {
    next(error);
  }
});

// Atualiza tudo
router.put("/:id", async (req, res, next) => {
  try {
    const { titulo, descricao, status } = req.body;
    const tarefa = await Tarefa.findByPk(req.params.id);

    if (!tarefa) return res.status(404).json({ mensagem: "Não encontrada" });

    tarefa.titulo = titulo ?? tarefa.titulo;
    tarefa.descricao = descricao ?? tarefa.descricao;
    tarefa.status = status ?? tarefa.status;
    tarefa.concluida = status === "concluida";
    tarefa.concluidaEm = status === "concluida" ? new Date() : null;

    await tarefa.save();
    res.json(tarefa);
  } catch (error) {
    next(error);
  }
});

// Atualiza apenas status (rota opcional)
router.patch("/:id/status", async (req, res, next) => {
  try {
    const { status } = req.body;
    const tarefa = await Tarefa.findByPk(req.params.id);

    if (!tarefa) return res.status(404).json({ mensagem: "Não encontrada" });

    tarefa.status = status;
    tarefa.concluida = status === "concluida";
    tarefa.concluidaEm = status === "concluida" ? new Date() : null;

    await tarefa.save();
    res.json(tarefa);
  } catch (error) {
    next(error);
  }
});

// Deletar
router.delete("/:id", async (req, res, next) => {
  try {
    await Tarefa.destroy({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
