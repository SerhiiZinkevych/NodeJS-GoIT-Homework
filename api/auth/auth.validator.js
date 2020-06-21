const Joi = require("@hapi/joi");

module.exports.authRegisterValidate = (req, res, next) => {
  const registerUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .required()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    gender: Joi.any().valid("male", "female").required(),
  });
  const result = registerUserSchema.validate(req.body);

  if (result.error) {
    return res.status(400).send(result.error);
  }
  next();
};

module.exports.authLoginValidate = (req, res, next) => {
  const loginUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .required()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  });
  const result = loginUserSchema.validate(req.body);

  if (result.error) {
    return res.status(400).send(result.error);
  }
  next();
};
