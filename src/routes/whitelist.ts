import express, { Request, Response } from "express";

import { whitelists } from "../db/whitelist";
import { WhitelistModel } from "../models/whitelist";
import { NotFoundError } from "../errors/not-found-error";
import { validateRequest } from "../middlewares/validate-request";
import {
  postValidatorObject,
  postValidatorBulkObject,
} from "../helpers/validation";

const router = express.Router();

const saveWhitelist = (path: string, ip: string[]) => {
  const whitelist = whitelists[path];

  let Whitelist: WhitelistModel = new WhitelistModel(path, ip);

  if (whitelist) {
    Whitelist = new WhitelistModel(path, whitelist.ips);
    Whitelist.setIp(ip);
  }

  whitelists[path] = { ips: Whitelist.ips, path };
};

export const saveObject = { saveWhitelist };

router.get("/whitelists", (req: Request, res: Response) => {
  return res.status(200).send({
    status: 200,
    data: whitelists,
  });
});

router.post(
  "/whitelists",
  postValidatorObject,
  validateRequest,
  (req: Request, res: Response) => {
    const { path, ip }: { path: string; ip: string } = req.body;

    saveObject.saveWhitelist(path, [ip]);

    return res.status(200).send({
      status: 200,
      data: whitelists[path],
    });
  }
);

router.post(
  "/whitelists/bulk",
  postValidatorBulkObject,
  validateRequest,
  (req: Request, res: Response) => {
    const { path, ips }: { path: string; ips: string[] } = req.body;

    saveWhitelist(path, ips);

    return res.status(200).send({
      status: 201,
      data: whitelists[path],
    });
  }
);

router.delete(
  "/whitelists/remove",
  postValidatorObject,
  validateRequest,
  (req: Request, res: Response) => {
    const { path, ip }: { path: string; ip: string } = req.body;
    const whitelist = whitelists[path];

    if (!whitelist) {
      throw new NotFoundError();
    }

    whitelists[path] = {
      path,
      ips: whitelist.ips.filter((whitelistedIp) => whitelistedIp !== ip),
    };

    return res.status(200).send({
      status: 200,
      data: whitelists[path],
    });
  }
);

export { router as whitelistRouter };
