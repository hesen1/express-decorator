import * as vm from "vm";
import * as fs from "fs";
import * as path from "path";
import * as core from "express-serve-static-core";
import { expansion } from "./util";

/**
 * 扩展Router声明
 * @extends core.Router
 */
export interface Router extends core.Router {
  [key: string]: any;
}

/**
 * 注册路由
 * @param router express的Router对象
 * @param controllers 路由中间件
 * @param rootUrl 根路由
 * @param midwares rootUrl路由中间件
 */
export function registerRoutes(router: Router, controllers: any[], rootUrl?: string, ...midwares: (core.RequestHandler[] | core.RequestHandler)[]): void {
  rootUrl = rootUrl || "";
  if (midwares && midwares.length) { //  && rootUrl
    midwares = expansion(...midwares);
    for (const midware of midwares) {
      rootUrl ? router.use(rootUrl, midware) : router.use(midware);
    }
  }
  for (const target of controllers) {
    const instance = new target();
    const keys: any[] = Reflect.ownKeys(target.prototype._routes);
    const routes: any = target.prototype._routes;
    for (let key of keys) {
      key = String(key);
      if (key === "baseUrl") {
        continue;
      }
      for (const item of routes[key]) {
        item.midwares.push(instance[key]);
        router[item.method](`${rootUrl}${routes.baseUrl}${item.subUrl}`, ...item.midwares);
      }
    }
  }
}

export function autoRegisterRoutes(router: Router, dirPath: string, rootPath?: string, ...midwares: (core.RequestHandler[] | core.RequestHandler)[]): void {
  if (typeof dirPath !== "string" || !dirPath.length) throw new Error("need controller directory path");
  dirPath = path.normalize(dirPath);
  rootPath = rootPath || "";

  if (!fs.existsSync(dirPath)) throw new Error("directory does not exist");
  const filenames: string[] = fs.readdirSync(dirPath);

  if (midwares && midwares.length) {
    midwares = expansion(...midwares);
    for (const midware of midwares) {
      rootPath ? router.use(rootPath, midware) : router.use(midware);
    }
  }

  for (const file of filenames) {
    const target = vm.runInNewContext(`(() => { return require('${file.substring(0, file.lastIndexOf(".") + 1)}') });`);
    const instance = new target();
    const keys: any[] = Reflect.ownKeys(target.prototype._routes);
    const routes: any = target.prototype._routes;
    for (let key of keys) {
      key = String(key);
      if (key === "baseUrl") {
        continue;
      }
      for (const item of routes[key]) {
        item.midwares.push(instance[key]);
        router[item.method](`${rootPath}${routes.baseUrl}${item.subUrl}`, ...item.midwares);
      }
    }
  }
}
