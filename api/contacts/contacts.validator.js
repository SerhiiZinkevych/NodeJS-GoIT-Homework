const Joi = require("@hapi/joi");

module.exports.validateUpdateContact = (body) => {
  const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email(),
    phone: Joi.string(),
  });
  console.log(body);
  const result = updateContactSchema.validate(body);

  return result;
};

module.exports.validateCreateContact = (body) => {
  const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
  });
  const result = createContactSchema.validate(body, {
    presence: "required",
  });

  return result;
};
