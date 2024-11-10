const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const userValidationRules = (isLogin = false) => {
    const rules = [];

    // Registration requires a name
    if (!isLogin) {
        rules.push(
            body('name')
                .isString()
                .notEmpty()
                .withMessage('Name is required.')
        );
    }

    // Email validation
    rules.push(
        body('email')
            .isEmail()
            .withMessage('A valid email is required.')
    );

    // Only check for existing email during registration
    if (!isLogin) {
        rules.push(
            body('email').custom(async (value) => {
                const userExists = await User.findOne({ where: { email: value } });
                if (userExists) {
                    throw new Error('Email already in use.');
                }
                return true;
            })
        );
    }

    // Password validation for registration only
    if (!isLogin) {
        rules.push(
            body('password')
                .isLength({ min: 6 })
                .withMessage('Password must be at least 6 characters long.')
                .matches(/(?=.*[0-9])/)
                .withMessage('Password must contain at least one number.')
                .matches(/(?=.*[!@#$%^&*])/)
                .withMessage('Password must contain at least one special character.')
        );
    }

    // Phone validation
    rules.push(
        body('phone')
            .optional()
            .isString()
            .matches(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/)
            .withMessage('Phone number must be in the format 123-456-7890.')
    );

    // Role validation
    rules.push(
        body('role')
            .optional()
            .isIn(['user', 'admin', 'vendor'])
            .withMessage('Role must be one of the following: user, admin, vendor.')
    );

    return rules;
};

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Validation errors occurred.',
            errors: errors.array(),
        });
    }
    next();
};

module.exports = {
    userValidationRules,
    validate,
};
