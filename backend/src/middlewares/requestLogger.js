
export default function requestLogger(req, res, next) {
  const start = Date.now();
  const { method, originalUrl } = req;
  const body = req.body && Object.keys(req.body).length ? req.body : null;

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${method} ${originalUrl} ${res.statusCode} - ${duration}ms`, 
      body ? `body=${JSON.stringify(body)}` : '');
  });

  next();
}
