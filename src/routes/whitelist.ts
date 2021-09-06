import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import { whitelists } from "../db/whitelist";
import { WhitelistModel } from "../models/whitelist";
import { RequestValidationError } from "../errors/request-validation-error";
import { NotFoundError } from "../errors/not-found-error";

const router = express.Router();

const postValidatorObject = [
  body("path")
    .trim()
    .exists()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Path is required"),
  body("ip")
    .isString()
    .matches(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)
    .withMessage("Must be a valid IP address"),
];

const validatePostValidatorBody = (req: express.Request) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
};

router.get("/whitelists", (req: Request, res: Response) => {
  return res.status(200).send({
    status: 200,
    data: whitelists,
  });
});

router.post(
  "/whitelists",
  postValidatorObject,
  (req: Request, res: Response) => {
    validatePostValidatorBody(req);
    const { path, ip }: { path: string; ip: string } = req.body;

    const whitelist = whitelists[path];

    let Whitelist: WhitelistModel = new WhitelistModel(path, [ip]);

    if (whitelist) {
      Whitelist = new WhitelistModel(path, whitelist.ips);
      Whitelist.setIp([ip]);
    }

    whitelists[path] = { ips: Whitelist.ips, path };

    return res.status(200).send({
      status: 200,
      data: whitelists[path],
    });
  }
);

router.post(
  "/whitelists/remove",
  postValidatorObject,
  (req: Request, res: Response) => {
    validatePostValidatorBody(req);
    const { path, ip }: { path: string; ip: string } = req.body;

    const whitelist = whitelists[path];

    if (!whitelist) {
      throw new NotFoundError();
    }

    whitelists[path] = { path, ips: whitelist.ips.filter(whitelistedIp => whitelistedIp !== ip) };

    return res.status(200).send({
      status: 200,
      data: whitelists[path],
    });
  }
);

export { router as whitelistRouter };
