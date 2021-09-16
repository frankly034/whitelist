import { body } from "express-validator";

export const postValidatorObject = [
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
