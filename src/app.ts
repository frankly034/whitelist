import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
import { whitelistRouter } from "./routes/whitelist";
import { forbiddenHandler } from "./middlewares/forbidden-handler";

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.set("trust proxy", true);

// list all open routes
app.use(whitelistRouter);

app.use(forbiddenHandler);

// list all protected routes
app.get("/protected", (req: express.Request, res: express.Response) => {
  return res.status(200).send({
    status: 200,
    data: {
      message: "Welcome to a protected route",
    },
  });
});

app.all("*", (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

const router = express.Router();

export { app, router };
