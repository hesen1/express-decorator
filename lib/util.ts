import { isArray } from "util";
import * as core from "express-serve-static-core";

/**
 * 扩展中间件参数
 * @param midwares 中间件
 */
export function expansion(...midwares: (core.RequestHandler[] | core.RequestHandler)[]): (core.RequestHandler[] | core.RequestHandler)[] {
  const list: core.RequestHandler[] = [];

  for (const item of midwares) isArray(item) ? list.push(...item) : list.push(item);

  return list;
}