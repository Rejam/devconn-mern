const Joi = require("joi");

const educationSchema = Joi.object()
  .keys({
    school: Joi.string().required(),
    degree: Joi.string().required(),
    fieldofstudy: Joi.string().required(),
    from: Joi.date().required(),
    to: Joi.date(),
    current: Joi.boolean().required(),
    description: Joi.string().required()
  })
  .required();

module.exports = educationSchema;
