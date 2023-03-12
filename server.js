const express = require('express')
const app = express()
const UserRoute = require('./Routes/User.route')
const createError = require('http-errors')
require('dotenv').config()
// require('./helpers/connections_mongodb');
const redisClient = require('./helpers/connections_redis');
const PORT = process.env.PORT || 3001

app.get('/', (req, res) => {
  console.log('a:::', a)
  res.send('Hello World!')
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/user', UserRoute)

app.use((req, res, next) => {
  const error = createError.NotFound('This router does not exist.')
  next(error)
})

app.use((err, req, res, next) => {
  res.json({
    status: err.status || 500,
    message: err.message
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`)
})
