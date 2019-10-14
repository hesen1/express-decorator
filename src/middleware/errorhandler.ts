// Copyright 2018 齐建兵 (qijianbing2000@163.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import { Request, Response, NextFunction } from "express";
import { HttpResponse } from "@sen.he/express-decorate";

import { NODE_ENV } from "../config/env";

// sakura errorHandler
export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof HttpResponse) {
    const httpCode: number = err.httpCode;
    delete err.httpCode;
    res.status(httpCode).json(err);
  } else if (NODE_ENV === "development") {
    next(err);
  } else {
    res.status(500).send(`Internal Server Error:\n${err.message}`);
  }
}
