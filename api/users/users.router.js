const { Router } = require("express");
const UsersController = require("./users.controller");
const UsersValidator = require("./users.validator");

const AuthController = require("../auth/auth.controller");

const usersRouter = Router();

usersRouter.get("/", AuthController.authorize, UsersController.getUsers);

usersRouter.get(
  "/current",
  AuthController.authorize,
  UsersController.getCurrentUser
);

usersRouter.get("/:id", AuthController.authorize, UsersController.getUserById);

usersRouter.delete(
  "/:id",
  AuthController.authorize,
  UsersValidator.validateId,
  UsersController.deleteUserById
);

usersRouter.patch(
  "/",
  AuthController.authorize,
  UsersValidator.validateUpdateUser,
  UsersController.updateUserById
);

usersRouter.patch(
  "/:id",
  AuthController.authorize,
  UsersValidator.validateId,
  UsersValidator.validateUpdateUser,
  UsersController.updateUserById
);

module.exports = usersRouter;
