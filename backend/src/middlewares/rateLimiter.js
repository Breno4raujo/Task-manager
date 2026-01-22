
const windows = new Map();
const WINDOW_MS = 10_000; // 10 segundos
const MAX_REQUESTS = 20;

export default function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = windows.get(ip) || { count: 0, start: now };

  if (now - entry.start > WINDOW_MS) {
    entry.count = 1;
    entry.start = now;
  } else {
    entry.count += 1;
  }

  windows.set(ip, entry);

  if (entry.count > MAX_REQUESTS) {
    return res.status(429).json({
      error: {
        message: 'Muitas requisições. Tente novamente mais tarde.',
        code: 'ERR_RATE_LIMIT',
        details: { windowMs: WINDOW_MS, max: MAX_REQUESTS }
      }
    });
  }

  next();
}
