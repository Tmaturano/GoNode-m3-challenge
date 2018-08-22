const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  friends: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  posts: [{ type: mongoose.Schema.ObjectId, ref: 'Post' }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/* Hook that everytime a user is used, we check if the password has been modified
   or not before everything.
   If it was, then we encrypt the password
*/
UserSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) next();

  this.password = await bcrypt.hash(this.password, 8);
});

UserSchema.methods = {
  compareHash(password) {
    return bcrypt.compare(password, this.password);
  },
  generateToken() {
    return jwt.sign({ id: this.id }, authConfig.secret, {
      expiresIn: 86400, // 1 day
    });
  },
};

mongoose.model('User', UserSchema);
