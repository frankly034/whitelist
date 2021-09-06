import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { errorHandler } from "./middlewares/error-handler";

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.all("*", (req, res) => {
  res.status(200).send({
    data: {
      message: "Welcome to whitelist",
    },
  });
});

app.use(errorHandler);

export { app };
