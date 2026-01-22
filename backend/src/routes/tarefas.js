import express from 'express';
import {
  criarTarefa,
  listarTarefas,
  buscarTarefaPorId,
  atualizarTarefa,
  atualizarStatus,
  deletarTarefa
} from '../controllers/tarefaController.js';

import { validateCreateOrUpdate, validateStatus } from '../middlewares/validateTarefa.js';

const router = express.Router();

router.post('/', validateCreateOrUpdate, criarTarefa);
router.get('/', listarTarefas);
router.get('/:id', buscarTarefaPorId);
router.put('/:id', validateCreateOrUpdate, atualizarTarefa);
router.patch('/:id/status', validateStatus, atualizarStatus);
router.delete('/:id', deletarTarefa);

export default router;
