const authMiddleware = (req, res, next) => {
  if (req.session && req.session.user) {
    // User is logged in
    req.user = req.session.user; // { id, name, email } etc.
    next();
  } else {
    res.status(401).json({ message: 'Not authorized, please log in' });
  }
};
module.exports = authMiddleware;
