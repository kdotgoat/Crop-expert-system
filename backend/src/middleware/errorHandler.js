
export function requestLogger(req, res, next) {
  const start = Date.now();
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    const log = `[${new Date().toISOString()}] ${req.method} ${req.path} → ${res.statusCode} (${duration}ms)`;
    
    if (res.statusCode >= 400) console.error(log);
    else console.log(log);
  });
  
  next();
}


export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  

  console.error(`[ERROR] ${new Date().toISOString()} - ${err.message}`);
  console.error(err.stack);

  res.status(status).json({
    success: false,
    error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}


