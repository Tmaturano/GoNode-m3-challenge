const express = require('express');
const requireDir = require('require-dir');

const routes = express.Router();

const authMiddleware = require('./middlewares/auth');

const controllers = requireDir('./controllers');

/**
 * Auth
 */
routes.post('/signup', controllers.authController.signup);
routes.post('/signin', controllers.authController.signin);

/**
 * ============
 * Auth routes
 */

routes.use(authMiddleware);

/**
 * Users
 */
routes.put('/users', controllers.userController.update);
routes.get('/users/me', controllers.userController.information);
routes.get('/users/feed', controllers.userController.feed);

/**
 * Posts
 */
// routes.post('/posts', controllers.postController.create);
// routes.delete('/posts/:id', controllers.postController.destroy);

module.exports = routes;
