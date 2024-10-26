const express = require('express');
const { register, login } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-token', verifyToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

module.exports = router;