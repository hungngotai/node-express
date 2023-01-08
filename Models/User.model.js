const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const { testConnection } = require('../helpers/connections_mutil_mongodb')

const UserSchema = new Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.pre('save', async function(next) {
  try {
    const salt =  await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(this.password, salt);
    this.password = hashPassword;
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.checkPassword = async function(password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    next(error);
  }
}

module.exports = testConnection.model('users', UserSchema);
