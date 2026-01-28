const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ message: "Admin not found" });
  }
  next();
};

module.exports = adminMiddleware;
