const Joi = require("joi");

const postSchema = Joi.object()
  .keys({
    user: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
    text: Joi.string().required(),
    likes: Joi.array(),
    name: Joi.string(),
    avatar: Joi.string(),
    date: Joi.date(),
    comments: Joi.array()
  })
  .required();

module.exports = postSchema;
