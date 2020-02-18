'use strict';

const User = require('../models/user');

const deserializeUser = (req, res, next) => {
  const userId = req.session.userId;

  // if the user is logged in, we look for the him at the database
  if (userId) {
    User.findById(userId)
      .then(signedUser => {
        if (!signedUser) {
          delete req.session.userId;
        } else {
          // console.log('logged in user is ', signedUser);
          req.user = signedUser;
          res.locals.user = req.user;
          next();
        }
        //next();
      })
      .catch(error => {
        next(error);
      });
  } else {
    next();
  }
};

module.exports = deserializeUser;
