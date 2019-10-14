import express from "express";

import { registerRoutes } from "@sen.he/express-decorate";

import Test from "../controller/test";

const router: any = express.Router();

registerRoutes(router, [Test], "/v2", (req: any, res: any, next: any) => {
  console.log("router middware");
  next();
});

export default router;
