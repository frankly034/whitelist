import chai from "chai";
import chaiHttp from "chai-http";

const { app } = require("../app");

chai.use(chaiHttp);
const { expect } = chai;

describe("Index", async () => {
  it("should return without errors", () => {
    chai
      .request(app)
      .get("/")
      .end((err: Error, res: Express.Response) => {
        expect(err).to.be.null;
      });
  });
});
