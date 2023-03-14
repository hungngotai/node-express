const express = require('express')
const route = express.Router();
const createError = require('http-errors')
const User = require('../Models/User.model');
const { userValidate } = require('../helpers/validation');
const { signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken } = require('../helpers/jwt_service');
const redisClient = require('../helpers/connections_redis');
const UserControler = require('../Controllers/User.controller');

route.post('/register', UserControler.register)

route.post('/refresh-token', UserControler.refreshToken)

route.post('/login', UserControler.login)

route.post('/logout', UserControler.logout)

route.get('/getList', verifyAccessToken, UserControler.getList)

module.exports = route;
