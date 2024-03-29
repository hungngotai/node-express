const redis = require('redis');
const client = redis.createClient({
  port: 6379,
  host: '127.0.0.1'
});

client.on('error', err => console.log('Redis Client Error', err));
client.on('connected', () => console.log('Redis Client Connected'));
client.on('ready', () => console.log('Redis Client Ready'));
(async () => {
  await client.connect();
})()

module.exports = client;
