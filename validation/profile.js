const Joi = require("joi");

const profileSchema = Joi.object()
  .keys({
    user: Joi.string().required(),
    handle: Joi.string()
      .alphanum()
      .max(40)
      .required(),
    company: Joi.string(),
    website: Joi.string().uri(),
    location: Joi.string(),
    status: Joi.string().required(),
    skills: Joi.array().items(Joi.string()),
    bio: Joi.string(),
    githubusername: Joi.string(),
    experience: Joi.array().items(
      Joi.object().keys({
        title: Joi.string().required(),
        company: Joi.string().required(),
        location: Joi.string(),
        from: Joi.date().required(),
        to: Joi.date(),
        current: Joi.boolean(),
        description: Joi.string()
      })
    ),
    education: Joi.array().items(
      Joi.object().keys({
        school: Joi.string().required(),
        degree: Joi.string().required(),
        fieldofstudy: Joi.string().required(),
        from: Joi.date().required(),
        to: Joi.date(),
        current: Joi.boolean(),
        description: Joi.string()
      })
    ),
    social: Joi.object().keys({
      youtube: Joi.string().uri(),
      twitter: Joi.string().uri(),
      facebook: Joi.string().uri(),
      linkedin: Joi.string().uri(),
      instagram: Joi.string().uri()
    }),
    date: Joi.date()
  })
  .required();

module.exports = profileSchema;
