const { Router } = require("express");
const AuthValidator = require("./auth.validator");
const AuthController = require("./auth.controller");

const authRouter = Router();

authRouter.post(
  "/register",
  AuthValidator.authRegisterValidate,
  AuthController.register
);

authRouter.post(
  "/login",
  AuthValidator.authLoginValidate,
  AuthController.login
);

authRouter.post("/logout", AuthController.authorize, AuthController.logout);

authRouter.get("/verify/:verificationToken", AuthController.tokenVerification);

module.exports = authRouter;
