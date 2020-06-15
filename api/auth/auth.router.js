const { Router } = require("express");
const AuthValidator = require("./auth.validator");
const AuthController = require("./auth.controller");

const authRouter = Router();

authRouter.post(
  "/register",
  AuthValidator.authValidate,
  AuthController.register
);

authRouter.post("/login", AuthValidator.authValidate, AuthController.login);

authRouter.post("/logout", AuthController.authorize, AuthController.logout);

module.exports = authRouter;
