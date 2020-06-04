const Joi = require("@hapi/joi");
const {
  Types: { ObjectId },
} = require("mongoose");

module.exports.validateId = (req, res, next) => {
  const { contactId } = req.params;
  if (!ObjectId.isValid(contactId)) {
    return res.status(404).send();
  }
  next();
};

module.exports.validateUpdateContact = (req, res, next) => {
  const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email(),
    phone: Joi.string(),
    subscription: Joi.string(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    token: Joi.string().allow(""),
  });

  const result = updateContactSchema.validate(req.body);

  if (result.error) {
    return res.status(400).send(result.error);
  }
  next();
};

module.exports.validateCreateContact = (req, res, next) => {
  const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    subscription: Joi.string(),
    password: Joi.string()
      .required()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    token: Joi.string().required().allow(""),
  });
  const result = createContactSchema.validate(req.body);

  if (result.error) {
    return res.status(400).send(result.error);
  }
  next();
};
