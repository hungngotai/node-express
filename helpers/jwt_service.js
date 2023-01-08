const jwt = require('jsonwebtoken');

const signAccessToken = function(userId) {
  return new Promise(function(res, rej) {
    const payload = { userId };
    const secretKey = process.env.APP_KEY;
    const options = { expiresIn: '1h' };

    jwt.sign(payload, secretKey, options, function(error, token) {
      if (error) rej(error);
      res(token);
    });
  });
};

module.exports = {
  signAccessToken,
};
