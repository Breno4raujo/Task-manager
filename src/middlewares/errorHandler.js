
export default function errorHandler(err, req, res, next) {
  console.error(err);

  const errorResponse = {
    error: {
      message: err.message || 'Erro interno do servidor',
      code: err.code || 'ERR_INTERNAL',
      details: err.details || null
    }
  };

  let status = 500;

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    status = 400;
    errorResponse.error.code = 'ERR_VALIDATION';
    errorResponse.error.details = err.errors
      ? err.errors.map(e => ({ field: e.path, message: e.message }))
      : err.details;
    errorResponse.error.message = 'Dados inválidos';
  }

  if (err.status && Number.isInteger(err.status)) {
    status = err.status;
  }

  res.status(status).json(errorResponse);
}
