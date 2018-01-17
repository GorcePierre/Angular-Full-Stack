import * as express from 'express';
import * as jwt from 'express-jwt';

import CatCtrl from './controllers/cat';
import UserCtrl from './controllers/user';
import Cat from './models/cat';
import User from './models/user';

export default function setRoutes(app) {

  const router = express.Router();

  const auth = jwt({
    secret: process.env.SECRET_TOKEN,
    requestProperty: 'auth',
    credentialsRequired: false
  });

  const isLogged = (req, res, next) => {
    if (!req.auth || !req.auth.user) {
      res.status(401).send('invalid token');
    } else {
      next();
    }
  };

  const isAdmin = (req, res, next) => {
    if (!req.auth || !req.auth.user || req.auth.user.role != 'admin') {
      res.status(403).send('unauthorized');
    } else {
      next();
    }
  };

  const catCtrl = new CatCtrl();
  const userCtrl = new UserCtrl();

  // Cats
  router.route('/cats').get(isLogged, catCtrl.getAll);
  router.route('/cats/count').get(catCtrl.count);
  router.route('/cat').post(isAdmin, catCtrl.insert);
  router.route('/cat/:id').get(catCtrl.get);
  router.route('/cat/:id').put(catCtrl.update);
  router.route('/cat/:id').delete(catCtrl.delete);

  // Users
  router.route('/login').post(userCtrl.login);
  router.route('/users').get(userCtrl.getAll);
  router.route('/users/count').get(userCtrl.count);
  router.route('/user').post(userCtrl.insert);
  router.route('/user/:id').get(userCtrl.get);
  router.route('/user/:id').put(userCtrl.update);
  router.route('/user/:id').delete(userCtrl.delete);

  // Apply the routes to our application with the prefix /api
  app.use('/api', auth, router);

}
