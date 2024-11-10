const bcrypt = require('bcryptjs');
const { generateToken } = require('../helpers/tokenHelper'); // token helper
const User = require('../models/User');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET || 'Dev@v1@123!';
const JWT_EXPIRATION = '1h'; 
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'Dev2@v1@123!'; 
const JWT_REFRESH_EXPIRATION = '7d'; 
const OTP_EXPIRATION_TIME = 15 * 60 * 1000; // OTP expiration (15 minutes)

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Register User
const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role, phone, image } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            phone,
            image,
        });

        // Generate JWT tokens
        const accessToken = generateToken(newUser, JWT_SECRET, JWT_EXPIRATION);
        const refreshToken = generateToken(newUser, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRATION);

        // Respond with user data excluding sensitive information
        res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// User Login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT tokens
        const accessToken = generateToken(user, JWT_SECRET, JWT_EXPIRATION);
        const refreshToken = generateToken(user, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRATION);

        // Respond with token
        res.status(200).json({
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Change User Password
const changePassword = async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid old password' });
        }

        // Update password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Send OTP (For Password Reset)
const sendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Store OTP and set expiration time (15 minutes)
        user.otp = otp;
        user.otpExpiration = Date.now() + OTP_EXPIRATION_TIME;
        await user.save();

        // Send OTP via email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Failed to send OTP' });
            }
            res.json({ message: 'OTP sent successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({ where: { email, otp } });
        if (!user || user.otpExpiration < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.otp = null; 
        user.otpExpiration = null; 
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get All Users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();

        res.json(users.map(user => {
            const userCopy = user.toJSON();
            delete userCopy.password; // Exclude sensitive data (password)
            return userCopy;
        }));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Single User
const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userCopy = user.toJSON();
        delete userCopy.password; // Exclude sensitive data (password)
        res.json(userCopy);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update User
const updateUser = async (req, res) => {
    const { id, name, email, role, phone, image } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name;
        user.email = email;
        user.role = role;
        user.phone = phone;
        user.image = image;

        await user.save();
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    const { id } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();
        res.json({ message: 'User deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createUser,
    loginUser,
    changePassword,
    sendOtp,
    resetPassword,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
};
