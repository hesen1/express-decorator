import { isArray } from "util";
import * as core from "express-serve-static-core";
import { expansion } from "./util";

// TODO: 此节路由注册的中间件不能让子级用，path就是一个完整的路由了
function path(baseUrl: core.PathParams, ...baseMidwares: (core.RequestHandler[] | core.RequestHandler)[]): (target: any) => void {
  return (target: any) => {
    !target.prototype._routes && (target.prototype._routes = {});
    target.prototype._routes.baseUrl = baseUrl;
    if (baseMidwares) {
      baseMidwares = expansion(...baseMidwares);
      target.prototype._routes.baseMidwares = !isArray(baseMidwares) ? [baseMidwares] : baseMidwares;
    }
  };
}

/**
 * 构造一个路由装饰器
 * @param httpMehod http methods
 */
const methodFactory = (httpMehod: string): (url: core.PathParams, ...midwares: (core.RequestHandler[] | core.RequestHandler)[]) => (
  target: any,
  methodName: string,
  descriptor: PropertyDescriptor
) => void => {
  return (url: string, ...midwares: (core.RequestHandler[] | core.RequestHandler)[]) => {
    const method: string = httpMehod;
    midwares = midwares || [];

    if (midwares.length) midwares = expansion(...midwares);

    return (target: any, methodName: string, descriptor: PropertyDescriptor) => {
      !target._routes && (target._routes = {});
      if (target._routes.hasOwnProperty(methodName)) {
        target._routes[methodName].push({
          method,
          midwares,
          subUrl: url
        });
      } else {
        target._routes[methodName] = [{
          method,
          midwares,
          subUrl: url
        }];
      }
    };
  };
};

/**
 * 注册GET路由,用于class的方法
 * @param url 子路由
 * @param midwares 路由中间件
 * @example @GET("/index")
 */
export const GET = methodFactory("get");

/**
 * 注册DELETE路由,用于class的方法
 * @param url 子路由
 * @param midwares 路由中间件
 * @example @DELETE("/index")
 */
export const DELETE = methodFactory("delete");

/**
 * 注册POST路由,用于class的方法
 * @param url 子路由
 * @param midwares 路由中间件
 * @example @POST("/index")
 */
export const POST = methodFactory("post");

/**
 * 注册PUT路由,用于class的方法
 * @param url 子路由
 * @param midwares 路由中间件
 * @example @PUT("/index")
 */
export const PUT = methodFactory("put");

/**
 * 注册一级路由,用于class
 * @param baseUrl 父路由
 * @param baseMidwares 一级中间件
 * @example @Path("/users")
 */
export const Path = path;
