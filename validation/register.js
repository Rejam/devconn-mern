const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(30)
    .label("Name must be between 2 and 30 characters")
    .required(),
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .label("Must be a valid email address")
    .required(),
  password: Joi.string()
    .alphanum()
    .min(6)
    .max(30)
    .label("Password must be between 6 and 30 characters")
    .required(),
  password2: Joi.string()
    .valid(Joi.ref("password"))
    .label("Confirmation must match password")
    .required()
});

module.exports = registerSchema;
