export const authenticate = (req, res, next) => {
  // Check if user is authenticated
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};