import express, { Request, Response, NextFunction } from "express";
import { SuccessResponse } from "@sen.he/express-decorate";

const router: express.Router = express.Router();

router.get("/v1", (req: Request, res: Response, next: NextFunction) => {
  next(new SuccessResponse({ msg: "Ok" }));
});

export default router;
