import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
import { whitelistRouter } from "./routes/whitelist";

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(whitelistRouter);

app.all("*", (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

const router = express.Router();

export { app, router };
