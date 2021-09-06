import { Request, Response, NextFunction } from "express";

import { whitelists } from "../db/whitelist";
import { ForbiddenError } from "../errors/forbidden-error";

export const forbiddenHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const foundPath = whitelists[req.path];
  if(foundPath && !foundPath.ips.includes(req.ip)){
    throw new ForbiddenError();
  }
  return next();
};
