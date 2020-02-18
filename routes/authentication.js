'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');

const bcryptjs = require('bcryptjs');

const User = require('./../models/user');

router.get('/sign-up', (req, res, next) => {
  res.render('authentication/sign-up');
});

router.post('/sign-up', (req, res, next) => {
  const { name, username, password } = req.body;

  bcryptjs
    .hash(password, 10)
    .then(hash => {
      return User.create({
        name,
        username,
        passwordHash: hash
      });
    })
    .then(user => {
      // set the session after the user created the account
      req.session.userId = user._id;
      res.redirect('/');
    })
    .catch(error => {
      next(error);
    });
});

router.get('/sign-in', (req, res, next) => {
  res.render('authentication/sign-in');
});

router.post('/sign-in', (req, res, next) => {
  const { username, password } = req.body;

  let user;

  User.findOne({ username })
    .then(result => {
      if (!result) {
        next(new Error('USER_NOT_FOUND'));
      } else {
        user = result;
        return bcryptjs.compare(password, result.passwordHash);
      }
    })
    .then(match => {
      if (match) {
        req.session.userId = user._id;
        //console.log('user id', user._id);
        res.redirect('/');
      } else {
        next(new Error('USER_PASSWORD_WRONG'));
      }
    })
    .catch(error => {
      next(error);
    });
});

router.get('/main', routeGuard, (req, res, next) => {
  res.render('authentication/main');
});

router.get('/private', routeGuard, (req, res, next) => {
  res.render('authentication/private');
});

router.get('/profile', routeGuard, (req, res, next) => {
  res.render('authentication/profile');
});

router.get('/profile/edit', routeGuard, (req, res, next) => {
  res.render('authentication/edit');
});

router.post('/profile/edit', routeGuard, (req, res, next) => {
  const { name } = req.body;
  const userId = req.session.userId;
  User.findByIdAndUpdate(userId, { name })
    .then(userUpdate => {
      console.log("User's name was updated", userUpdate);
      res.redirect('/authentication/profile');
    })
    .catch(error => {
      next(error);
    });
});

router.post('/sign-out', (req, res, next) => {
  // destroy the session object at MongoDB
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
