const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300,
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model('Comment', CommentSchema);
