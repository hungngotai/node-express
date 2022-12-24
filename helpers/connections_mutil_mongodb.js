const mongoose = require('mongoose');

function createConnection(uri) {
  const conn = mongoose.createConnection(uri);

  conn.on('connected', function () {
    console.log(`Mongodb::: connected:: ${this.name}`);
  });

  conn.on('disconnected', function () {
    console.log(`Mongodb::: disconnected:: ${this.name}`);
  });

  conn.on('error', function (error) {
    console.log(`Mongo::: error:: ${JSON.stringify(error)}`);
  });

  process.on('SIGINT', async () => {
    await conn.close();
    process.exit(0);
  })

  return conn;
}

const testConnection = createConnection('mongodb://127.0.0.1:27017/test')
const userConnection = createConnection('mongodb://127.0.0.1:27017/user')

module.exports = {
  testConnection,
  userConnection
}
