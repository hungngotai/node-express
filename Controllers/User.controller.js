const createError = require('http-errors')
const User = require('../Models/User.model');
const { userValidate } = require('../helpers/validation');
const { signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken } = require('../helpers/jwt_service');
const redisClient = require('../helpers/connections_redis');

const UserControler = {
  register: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { error } = userValidate(req.body);
      if (error) throw createError(error.details[0].message);

      const isExist = await User.findOne({ username: email });
      if (isExist) throw createError.Conflict(`${email} is already been registered.`);

      const user = new User({ username: email, password });
      await user.save();
      return res.json({
        status: 'Ok',
        elements: user
      });
    } catch(error) {
      next(error);
    }
  },
  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw createError.BadRequest();

      const {userId} = await verifyRefreshToken(refreshToken);
      const accessToken = await signAccessToken(userId);
      const newRefreshToken = await signRefreshToken(userId);
      return res.json({
        status: 'Ok',
        accessToken,
        refreshToken: newRefreshToken
      });
    } catch (error) {
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { error } = userValidate(req.body);
      if (error) throw createError(error.details[0].message);

      const user = await User.findOne({ username: email });
      if (!user) throw createError.NotFound(`${email} is not registered.`);

      const isValid = await user.checkPassword(password);
      if(!isValid) throw createError.Unauthorized();

      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);
      return res.json({
        status: 'Ok',
        accessToken,
        refreshToken
      });
    } catch(error) {
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw createError.BadRequest();

      const {userId} = await verifyRefreshToken(refreshToken);
      redisClient.del(userId);
      return res.json({
        status: 'Ok'
      })
    } catch (error) {
      next(error);
    }
  },
  getList: (req, res, next) => {
    const list = [{ email: 'example_1@mail.com' }, { email: 'example_2@mail.com' }]
    return res.json({
      status: 'Ok',
      list
    })
  }
}

module.exports = UserControler
