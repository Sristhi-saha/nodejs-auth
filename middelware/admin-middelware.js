const isAdminUser = (req, res, next) => {
  if (req.userInfo.role !== "admin") {
    console.log(`Access denied for user: ${req.userInfo.userId} with role: ${req.userInfo.role}`);
    return res.status(403).json({
      success: false,
      message: "Access denied! Admin rights required.",
    });
  }
  // If user is an admin, allow access to the next route/middleware
  next();
};

module.exports = isAdminUser;
