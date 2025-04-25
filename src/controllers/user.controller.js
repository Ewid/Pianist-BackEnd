const User = require('../models/user.model');

const UserController = {};

UserController.getProfile = async (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile.', error: error.message });
    }
};

module.exports = UserController;