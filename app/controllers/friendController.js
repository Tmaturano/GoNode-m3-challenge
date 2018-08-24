const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports = {
  async create(req, res, next) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(400).json({ error: 'The friend you\'re trying to add was not found' });
      }

      if (user.friends.indexOf(req.userId) !== -1) {
        return res.status(400).json({ error: `You're already friend of the user ${user.userName}` });
      }

      user.friends.push(req.userId);
      await user.save();

      const me = await User.findById(req.userId);
      me.friends.push(user.id);
      me.save();

      return res.json(me);
    } catch (err) {
      return next(err);
    }
  },

  async remove(req, res, next) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(400).json({ error: 'User does not exists' });
      }

      const friends = user.friends.indexOf(req.userId);
      if (friends === -1) {
        return res.status(400).json({ error: `You're not friend of the user ${user.userName}` });
      }

      user.friends.splice(friends, 1);
      await user.save();

      const me = await User.findById(req.userId);
      me.friends.push(user.id);
      me.save();

      return res.json(me);
    } catch (err) {
      return next(err);
    }
  },
};
