const bcrypt = require('bcryptjs');
const User = require('../models/User');

const createUser = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return User.create({ ...userData, password: hashedPassword });
};

const getUserById = async (userId) => {
    return User.findByPk(userId);
};

const updateUser = async (userId, updateData) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    Object.assign(user, updateData);
    await user.save();
    return user;
};

const deleteUser = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');
    await user.destroy();
};

const getAllUsers = async () => {
    return User.findAll();
};

module.exports = {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    getAllUsers,
};
