const Joi = require("joi");

const experienceSchema = Joi.object()
  .keys({
    title: Joi.string().required(),
    company: Joi.string().required(),
    location: Joi.string().required(),
    from: Joi.date().required(),
    to: Joi.date(),
    current: Joi.boolean().required(),
    description: Joi.string().required()
  })
  .required();

module.exports = experienceSchema;
