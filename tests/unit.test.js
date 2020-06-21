const AuthController = require("../api/auth/auth.controller");
const usersModel = require("../api/users/users.model");
const jwt = require("jsonwebtoken");
require("should");
const sinon = require("sinon");

describe("Unit tests authorization middleware", () => {
  describe("#Check Authorization header", () => {
    let actualResult;
    let nextStub;
    let jwtVerifyStub;
    let findUserByIdStub;
    const test_token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlZThlY2I1MDNmNmE3MDc3ZjA3NjA4YyIsImlhdCI6MTU5MjU1NjA2NH0.6f_AXb1x73QXxQG3LZq6ECSGl5x_Tds5ArkFlW1sEvg";

    before(() => {
      nextStub = sinon.stub();
      nextStub.throwsArg(0);
      jwtVerifyStub = sinon.stub(jwt, "verify");
      findUserByIdStub = sinon.stub(usersModel, "findById");
    });

    after(() => {
      jwtVerifyStub.restore();
      findUserByIdStub.restore();
    });

    it("should throw unauthorized error due authorization header absence", async () => {
      const req = { get: sinon.stub() };

      try {
        await AuthController.authorize(req, {}, nextStub);
      } catch (err) {
        actualResult = err;
      }
      actualResult.should.have.property("message", "Token not found");
    });

    it("should throw unauthorized error due token verification fail", async () => {
      req = {
        get: () => "Bearer invalidtoken",
      };

      jwtVerifyStub.throws();

      try {
        await AuthController.authorize(req, {}, nextStub);
      } catch (err) {
        actualResult = err;
      }
      actualResult.should.have.property("message", "Not authorized");
    });

    it("should throw unauthorized error => user with id from token not found in db", async () => {
      req = {
        get: () => "Bearer " + test_token,
      };

      findUserByIdStub.resolves(null);

      try {
        await AuthController.authorize(req, {}, nextStub);
      } catch (err) {
        actualResult = err;
      }

      actualResult.should.have.property("message", "Not authorized");
    });

    it("should throw unauthorized error => token from Authorization header and founded user's token are not equal", async () => {
      req = {
        get: () => "Bearer " + test_token,
      };

      findUserByIdStub.resolves({ token: "random_token" });

      try {
        await AuthController.authorize(req, {}, nextStub);
      } catch (err) {
        actualResult = err;
      }

      actualResult.should.have.property("message", "Not authorized");
    });
  });
});
