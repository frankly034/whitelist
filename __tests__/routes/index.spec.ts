import { Request, Response, NextFunction } from "express";
import chai from "chai";
import chaiHttp from "chai-http";

const { app } = require("../../src/app");

chai.use(chaiHttp);
const { expect } = chai;

describe("Index route", async () => {
  it("should return 404 error", () => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(err).to.be.null;
      });
  });
});
