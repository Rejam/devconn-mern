const Joi = require("joi");

const commentSchema = Joi.object()
  .keys({
    user: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
    text: Joi.string().required(),
    name: Joi.string(),
    avatar: Joi.string(),
    date: Joi.date()
  })
  .required();

module.exports = commentSchema;
