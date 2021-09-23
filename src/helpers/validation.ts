import { body } from "express-validator";

const validateIp = (field: string) =>
  body(field)
    .isString()
    .matches(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)
    .withMessage("Must be a valid IP address");

const validatePath = (field: string) =>
  body(field)
    .trim()
    .exists()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Path is required");

export const postValidatorObject = [
  validatePath("path"),
  validateIp("ip"),
];

export const postValidatorBulkObject = [
  body("ips").isArray(),
  validatePath("path"),
  validateIp("ips.*"),
];
