import chai from "chai";
import chaiHttp from "chai-http";
import sinon, { SinonStub } from "sinon";

import { app } from "../../src/app";
import { saveObject } from "../../src/routes/whitelist";
chai.use(chaiHttp);
const { expect } = chai;

const data = {
  ip: "127.0.0.1",
  path: "/",
};
const newData = {
  ip: "127.255.0.1",
  path: "/",
};

const bulkData = {
  ips: ["127.255.0.1", "127.255.0.2", "127.255.0.3"],
  path: "/protected",
};

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
      .send(data)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body.data).to.have.property("path").equal(data.path);
        expect(res.body.data).to.have.property("ips");
      });
  });

  it("should add a new whitelisted route to an existing path", () => {
    chai
      .request(app)
      .post("/whitelists")
      .send(newData)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body.data).to.have.property("path").equal(data.path);
        expect(res.body.data).to.have.property("ips");
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
        expect(res.body).to.have.property("errors");
      });
  });

  it("should add a new list of whitelist ips to route --> bulk ips", () => {
    chai
      .request(app)
      .post("/whitelists/bulk")
      .send(bulkData)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body.data).to.have.property("path").equal(bulkData.path);
        expect(res.body.data).to.have.property("ips");
        expect(res.body.data.ips).to.include(bulkData.ips[0]);
      });
  });

  it("should return a validation error on bulk route --> bulk ips", () => {
    const { path, ...errorBulkData } = bulkData;
    chai
      .request(app)
      .post("/whitelists")
      .send(errorBulkData)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.have.property("errors");
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
        expect(res.body).to.have.property("errors");
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

  it("should return success message for protected route", () => {
    chai
      .request(app)
      .post("/whitelists")
      .send({
        ip: "255.50.50.1",
        path: "/protected",
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body.data).to.have.property("ips");
      });

    chai
      .request(app)
      .get("/protected")
      .set("X-Forwarded-For", "255.50.50.1")
      .end((err, res) => {
        expect(res.status).to.equal(200);
      });
  });
});

describe("Error 500", () => {
  let stub: SinonStub;
  before(() => {
    stub = sinon.stub(saveObject, "saveWhitelist").throws(Error("Something went wrong"));
  });
  after(() => {
    stub.restore();
  });
  it("should throw 500 error for internal error", async () => {
    chai
      .request(app)
      .post("/whitelists")
      .send({
        ip: "127.0.0.1",
        path: "/unknown",
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.equal(500);
      });
  });
});
