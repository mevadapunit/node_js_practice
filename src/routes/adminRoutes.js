const express = require('express');
const {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
} = require('../controllers/adminController');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

const router = express.Router();
const API_VERSION = '/v1';

const adminGroup = express.Router();

adminGroup.get('/users', auth, roleGuard('admin'), getAllUsers);

adminGroup.get('/users/:id', auth, roleGuard('admin'), getUser);

adminGroup.put('/users/update', auth, roleGuard('admin'), updateUser);

adminGroup.delete('/users/delete', auth, roleGuard('admin'), deleteUser);

router.use(`${API_VERSION}/admin`, adminGroup);

module.exports = router;
