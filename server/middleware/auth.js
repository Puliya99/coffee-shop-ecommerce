const jwt = require('jsonwebtoken')

module.exports = {
  verifyToken: (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Access denied. No token provided.' })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = decoded
      next()
    } catch (error) {
      res.status(400).json({ message: 'Invalid token' })
    }
  },

  isAdmin: (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next()
    } else {
      res
        .status(403)
        .json({ message: 'Access denied. Admin privileges required.' })
    }
  },
}