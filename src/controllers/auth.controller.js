const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const AuthController = {};

AuthController.register = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }
    if (username.length < 3) {
        return res.status(400).json({ message: 'Username must be at least 3 characters long.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }
    if (/\s/.test(username)) {
        return res.status(400).json({ message: 'Username cannot contain spaces.' });
    }

    try {
        const newUser = await User.create({ username, password });


        const createdUser = await User.findById(newUser.id);
        if (!createdUser) {
            console.error('Failed to fetch user details after registration for ID:', newUser.id);
            return res.status(500).json({ message: 'Error fetching user details after registration.' });
        }

        const token = jwt.sign(
            { userId: createdUser.userId, username: createdUser.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        res.status(201).json({ message: 'User registered successfully.', user: createdUser, token });

    } catch (error) {
        console.error('Registration Error:', error);
        if (error.message === 'Username already exists.') {
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error registering user.', error: error.message });
    }
};

AuthController.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        if (user.accountStatus !== 'active') {
            return res.status(403).json({ message: `Account is ${user.accountStatus}. Please contact support.` });
        }

        const isMatch = await User.comparePassword(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { userId: user.userId, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        const userResponse = { ...user };
        delete userResponse.passwordHash;

        res.status(200).json({ message: 'Login successful.', token, user: userResponse });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Error logging in.', error: error.message });
    }
};

module.exports = AuthController; 