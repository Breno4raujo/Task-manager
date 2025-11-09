import { STATUS_VALUES } from '../models/tarefa.js';

function buildError(message, code = 'ERR_VALIDATION', status = 400, details = null) {
  const err = new Error(message);
  err.code = code;
  err.status = status;
  err.details = details;
  return err;
}

export function validateCreateOrUpdate(req, res, next) {
  const { titulo, descricao, status } = req.body;

  if (!titulo || String(titulo).trim() === '') {
    return next(buildError('O campo "titulo" é obrigatório.', 'ERR_MISSING_TITLE', 400));
  }

  if (!descricao || String(descricao).trim() === '') {
    return next(buildError('O campo "descricao" é obrigatório.', 'ERR_MISSING_DESCRIPTION', 400));
  }

  if (!status || String(status).trim() === '') {
    return next(buildError('O campo "status" é obrigatório.', 'ERR_MISSING_STATUS', 400));
  }

  if (!STATUS_VALUES.includes(status)) {
    return next(buildError(
      `Status inválido. Valores permitidos: ${STATUS_VALUES.join(', ')}`,
      'ERR_INVALID_STATUS',
      422
    ));
  }

  next();
}

export function validateStatus(req, res, next) {
  const { status } = req.body;
   if (!status || String(status).trim() === '') {
    return next(buildError('O campo "status" é obrigatório.', 'ERR_MISSING_STATUS', 400));
  }

  if (!STATUS_VALUES.includes(status)) {
    return next(buildError(
      `Status inválido. Valores permitidos: ${STATUS_VALUES.join(', ')}`,
      'ERR_INVALID_STATUS',
      422
    ));
  }

  next();
}
