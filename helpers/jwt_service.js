const createError = require('http-errors');
const JWT = require('jsonwebtoken');

const signAccessToken = (userId) => {
  return new Promise((res, rej) => {
    const payload = { userId };
    const secretKey = process.env.APP_KEY;
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
  JWT.verify(accessToken, process.env.APP_KEY, (error, payload) => {
    if (error) {
      return next(createError.Unauthorized())
    };
    req.payload = payload;
    next();
  });
}

module.exports = {
  signAccessToken,
  verifyAccessToken
};
