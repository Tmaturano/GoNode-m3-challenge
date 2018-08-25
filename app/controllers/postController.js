const mongoose = require('mongoose');

const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');
const User = mongoose.model('User');

module.exports = {
  async create(req, res, next) {
    try {
      const post = await Post.create({ ...req.body, user: req.userId });

      return res.json(post);
    } catch (err) {
      return next(err);
    }
  },

  async destroy(req, res, next) {
    try {
      await Post.findByIdAndRemove(req.params.id);
      return res.send();
    } catch (err) {
      return next(err);
    }
  },

  async comment(req, res, next) {
    try {
      const postId = req.params.id;

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(400).json({ error: 'Post not found' });
      }

      const postOwner = await User.findById(post.user);
      if (postOwner.friends.indexOf(req.userId) === -1) {
        return res.status(400).json({ error: 'You can\'t add a comment in this post because you aren\'t friend of the Post\'s owner' });
      }

      const comment = await Comment.create({ ...req.body, owner: req.userId, post: postId });
      post.comments.push(comment.id);
      await post.save();

      const postComments = await Comment.find({ post: postId });
      return res.json(postComments);
    } catch (err) {
      return next(err);
    }
  },
};
