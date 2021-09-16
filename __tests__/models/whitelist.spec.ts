import chai from "chai";
import { whitelists } from "../../src/db/whitelist";

import { WhitelistModel } from "../../src/models/whitelist";

const { expect } = chai;

describe("Index route", async () => {
    const ip = "127.0.0.1";
    const path = "/";
  const whitelist = new WhitelistModel(path, [ip]);
  it("should return model path --> string", () => {
    expect(whitelist.getPath()).to.equal(path);
  });

  it("should return model ips: getIps --> array of string", () => {
    expect(whitelist.getIps()).to.be.an('array');
  });

  it("should return ips containing '127.0.0.1'", () => {
    expect(whitelist.getIps()).to.be.an('array').that.contains(ip);
  })

  it("should return model ip availability status --> boolean true", () => {
    expect(whitelist.hasIp(ip)).to.be.a('boolean').that.is.true;
  });

  it("should return model ip availability status --> boolean false", () => {
    expect(whitelist.hasIp("127.0.0.3")).to.be.a('boolean').that.is.false;
  });
});
