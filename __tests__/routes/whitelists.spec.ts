import chai from "chai";
import chaiHttp from "chai-http";

const { app } = require("../../src/app");

chai.use(chaiHttp);
const { expect } = chai;

describe("Whitelist routes", async () => {
  const data = {
    ip: "127.0.0.1",
    path: "/",
  };
  const newData = {
    ip: "127.255.0.1",
    path: "/",
  };
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
      .send(data)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body.data).to.have.property('path').equal(data.path);
        expect(res.body.data).to.have.property('ips');
      });
  });

  it("should add a new whitelisted route to an existing path", () => {
    chai
      .request(app)
      .post("/whitelists")
      .send(newData)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body.data).to.have.property('path').equal(data.path);
        expect(res.body.data).to.have.property('ips');
        expect(res.body.data.ips).to.include(newData.ip);
      });
  });

  it("should return a validation error on create a new whitelisted route", () => {
    chai
      .request(app)
      .post("/whitelists")
      .send({
        ip: "127.0.0",
        path: "/",
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.have.property('errors');
      });
  });

  it("should remove existing whitelisted ip from route", () => {
    chai
      .request(app)
      .delete("/whitelists/remove")
      .send(newData)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body.data).to.have.property("path");
        expect(res.body.data).to.have.property("ips");
      });
  });

  it("should return a validation error on deleting an invalid request", () => {
    chai
      .request(app)
      .delete("/whitelists/remove")
      .send({
        ip: "127.0.0",
        path: "/",
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.have.property('errors');
      });
  });

  it("should throw 404 error if route is not found", () => {
    chai
      .request(app)
      .delete("/whitelists/remove")
      .send({
        ip: "127.0.0.1",
        path: "/unknown",
      })
      .end((err, res) => {
        expect(err).to.be.null;
      });
  });

  it("should throw an unknown error", () => {
    chai
      .request(app)
      .delete("/whitelists/remove")
      .send({
        ip: "127.0.0.1",
        path: "/unknown",
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
