// middleware/authMiddleware.js

// Middleware to check if the user is a doctor
exports.checkDoctorRole = (req, res, next) => {
    // Assuming the user role is stored in the request object after authentication
    const userRole = req.user.role;
  
    // Check if the user is a doctor
    if (userRole === 'doctor') {
      // User is a doctor, allow access
      next();
    } else {
      // User is not a doctor, send unauthorized error
      res.status(403).json({ error: 'Unauthorized' });
    }
  };
  
  // Define more middleware functions for other roles as needed
  