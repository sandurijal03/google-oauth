export const ensureAuth = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
};

export const ensureGuest = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/dashboard');
  } else {
    return next();
  }
};
