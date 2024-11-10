const express = require('express');
const {
    createUser,
    loginUser,
    changePassword,
    sendOtp,
    resetPassword,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
} = require('../controllers/userController');
const { userValidationRules, validate } = require('../validations/userValidation');
const auth = require('../middleware/auth');
const globalRateLimiter = require('../middleware/rateLimitMiddleware');

const router = express.Router();

router.use(globalRateLimiter); 

router.post('/register', userValidationRules(), validate, createUser);
router.post('/login', userValidationRules(true), validate, loginUser);
router.put('/change-password', auth, validate, changePassword);
router.post('/send-otp', auth, validate, sendOtp);
router.post('/reset-password', validate, resetPassword);
router.get('/', getAllUsers);
router.get('/:id', auth, getUser);
router.put('/update', auth, userValidationRules(true), validate, updateUser);
router.delete('/delete', auth, deleteUser);

module.exports = router;
