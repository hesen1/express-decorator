# install

`npm install @sen.he/express-decorate`


# Example

/controller/test.ts

```TypeScript
import { GET, Path, POST, DELETE, PUT, SuccessResponse, ErrorResponse } from "@sen.he/express-decorate";
import { Request, Response, NextFunction } from "express";

@Path("/users")
export default class Test {

  @GET("/index", (req: Request, res: Response, next: NextFunction) => {
    console.log("index middware");
    next();
  })
  public index(req: Request, res: Response, next: NextFunction) {
    next(new SuccessResponse({ msg: "Ok" }, 2001));
  }

  @DELETE("/name")
  @PUT("/update")
  @POST("/:id")
  @GET("/:id")
  public getUser(req: Request, res: Response, next: NextFunction) {
    next(new ErrorResponse("not found", 404));
  }

  @POST("/")
  public addUser(req: Request, res: Response, next: NextFunction) {
    next(new SuccessResponse({ id: req.body.id }));
  }

  @PUT("/:id")
  public updateUser(req: Request, res: Response, next: NextFunction) {
    next(new SuccessResponse({ id: req.params["id"] }));
  }

  @DELETE("/:id")
  public deleteUser(req: Request, res: Response, next: NextFunction) {
    next(new SuccessResponse({ id: req.params["id"] }));
  }
}

```

/route/v2.ts
```TypeScript
import express from "express";

import { registerRoutes } from "@sen.he/express-decorate";

import Test from "../controller/test";

const router: any = express.Router();

// GET /v2/users/index
registerRoutes(router, [Test], "/v2", (req: any, res: any, next: any) => {
  console.log("router middware");
  next();
});

export default router;
```
