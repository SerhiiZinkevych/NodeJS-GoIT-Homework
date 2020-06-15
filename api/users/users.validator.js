const Joi = require("@hapi/joi");
const {
  Types: { ObjectId },
} = require("mongoose");

module.exports.validateId = (req, res, next) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Not valid ID" });
  }
  next();
};

module.exports.validateUpdateUser = (req, res, next) => {
  const updateUserSchema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    subscription: Joi.any().valid("free", "pro", "premium"),
  });

  const result = updateUserSchema.validate(req.body);
  console.log(result);
  if (result.error) {
    return res.status(400).send(result.error);
  }
  next();
};
