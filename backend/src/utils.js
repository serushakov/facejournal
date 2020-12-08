import passport from 'passport';

export const nonBlockingAuth = (req, res, next) => {
  passport.authenticate('jwt', null, (err, user) => {
    if (user) {
      req.user = user;
    }
    return next();
  })(req, res, next);
};
