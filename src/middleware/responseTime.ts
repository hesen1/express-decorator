import { apiLog } from "../util/log";

import { Request, Response, NextFunction } from "express";

function responseTime(req: Request, res: Response, next: NextFunction) {
  const startTime: number = Date.now();

  const calResponseTime = () => {
    const endTime: number = Date.now();
    const time: number = (endTime - startTime) / 1000;
    apiLog(`[${new Date().toLocaleString()}] ${req.protocol} ${req.method} ${req.originalUrl} ${res.statusCode} time: ${time}ms`);
  };

  res.once("finish", calResponseTime);
  res.once("close", calResponseTime);
  next();
}

export default responseTime;
