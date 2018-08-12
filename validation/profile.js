const Joi = require("joi");

const profileSchema = Joi.object()
  .keys({
    user: Joi.string().required(),
    handle: Joi.string()
      .alphanum()
      .max(40)
      .required(),
    company: Joi.string(),
    website: Joi.string(),
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
      youtube: Joi.string(),
      twitter: Joi.string(),
      facebook: Joi.string(),
      linkedin: Joi.string(),
      instagram: Joi.string()
    }),
    date: Joi.date()
  })
  .required();

const options = {
  abortEarly: false
};
module.exports = function validateProfileData(data) {
  const { error } = Joi.validate(data, profileSchema, options);

  // create object of propname: error_message for each error
  const errors = error
    ? error.details.reduce((obj, err) => {
        return { ...obj, [err.context.key]: err.message };
      }, {})
    : {};
  const isValid = error === null;
  return { errors, isValid };
};
