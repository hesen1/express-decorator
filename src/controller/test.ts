import { GET, Path, POST, DELETE, PUT, SuccessResponse, ErrorResponse, ApiError, BadRequestResponse } from "@sen.he/express-decorate";
import { Request, Response, NextFunction } from "express";

// req: Request, res: Response, next: NextFunction

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
    next(new SuccessResponse({ id: req.params["id"], name: "lishi" }));
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
