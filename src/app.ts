import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

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

export { app };
