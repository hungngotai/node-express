const Joi = require('joi');

const userValidate = data => {
  const userSchema = Joi.object({
    email: Joi.string().lowercase().required(),
    password: Joi.string().required(),
  });

  return userSchema.validate(data);
}

module.exports = {
  userValidate
}
