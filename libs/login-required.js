export default (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect('/');
  } else {
    return next();
  }
};