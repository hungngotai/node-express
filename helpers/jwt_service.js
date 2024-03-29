const createError = require('http-errors');
const JWT = require('jsonwebtoken');
const redisClient = require('./connections_redis')

const signAccessToken = (userId) => {
  return new Promise((res, rej) => {
    const payload = { userId };
    const secretKey = process.env.APP_ACCESS_KEY;
    const options = { expiresIn: '1h' };

    JWT.sign(payload, secretKey, options, (error, token) => {
      if (error) rej(error);
      res(token);
    });
  });
};

const verifyAccessToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return next(createError.Unauthorized());
  };
  const accessToken = req.headers.authorization.split(' ')[1];
  JWT.verify(accessToken, process.env.APP_ACCESS_KEY, (error, payload) => {
    if (error?.name == 'JsonWebTokenError') {
      return next(createError.Unauthorized());
    };
    if (error?.name == 'TokenExpiredError') {
      return next(createError.Unauthorized(error.message));
    };
    req.payload = payload;
    next();
  });
}

const signRefreshToken = (userId) => {
  return new Promise((res, rej) => {
    const payload = { userId };
    const secretKey = process.env.APP_REFRESH_KEY;
    const options = { expiresIn: '1y' };

    JWT.sign(payload, secretKey, options, (error, token) => {
      if (error) rej(error);
      redisClient.set(userId, token);
      res(token);
    });
  });
};

const verifyRefreshToken = (refreshToken) => {
  return new Promise((res, rej) => {
    JWT.verify(refreshToken, process.env.APP_REFRESH_KEY, async (error, payload) => {
      if (error) {
        return rej(createError.BadRequest())
      }
      const { userId } = payload;
      const reply = await redisClient.get(userId);
      if (reply !== refreshToken) {
        return rej(createError.Unauthorized())
      }
      res(payload);
    })
  })
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken
};
