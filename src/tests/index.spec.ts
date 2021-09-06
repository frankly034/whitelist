import chai from "chai";
import chaiHttp from "chai-http";

const { app } = require("../app");

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

describe("Whitelist routes", async () => {
  it("should return an array of whitelisted routes and ips", () => {
    chai
      .request(app)
      .get("/whitelists")
      .end((err, res) => {
        expect(err).to.be.null;
      });
  });

  it("should create a new whitelisted route", () => {
    chai
      .request(app)
      .post("/whitelists")
      .send({
        ip: "127.0.0.1",
        path: "/"
      })
      .end((err, res) => {
        expect(err).to.be.null;
      });
  });

  it("should add a new whitelisted route to an existing path", () => {
    chai
      .request(app)
      .post("/whitelists")
      .send({
        ip: "127.255.0.1",
        path: "/"
      })
      .end((err, res) => {
        expect(err).to.be.null;
      });
  });

  it("should return a validation error on create a new whitelisted route", () => {
    chai
      .request(app)
      .post("/whitelists")
      .send({
        ip: "127.0.0",
        path: "/"
      })
      .end((err, res) => {
        expect(err).to.be.null;
      });
  });

  it("should remove existing whitelisted ip from route", () => {
    chai
      .request(app)
      .post("/whitelists/remove")
      .send({
        ip: "127.0.0.1",
        path: "/"
      })
      .end((err, res) => {
        expect(err).to.be.null;
      });
  });

  it("should throw 404 error if route is not found", () => {
    chai
      .request(app)
      .post("/whitelists/remove")
      .send({
        ip: "127.0.0.1",
        path: "/unknown"
      })
      .end((err, res) => {
        expect(err).to.be.null;
      });
  });
});

describe("Protected route", async () => {
  it("should return 403 error", () => {
    chai
      .request(app)
      .get("/protected")
      .end((err, res) => {
        expect(res.status).to.equal(403);
      });
  });
});
