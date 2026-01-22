
export default function notFound(req, res, next) {
  res.status(404).json({
    error: {
      message: 'Recurso não encontrado',
      code: 'ERR_NOT_FOUND'
    }
  });
}
