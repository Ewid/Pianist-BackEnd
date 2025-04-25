const UserProgress = require('../models/progress.model');

const ProgressController = {};

ProgressController.getUserProgress = async (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    try {
        const progressList = await UserProgress.findByUser(userId);
        res.status(200).json(progressList);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user progress.', error: error.message });
    }
};

ProgressController.getSongProgress = async (req, res) => {
    const userId = req.user?.userId;
    const songId = parseInt(req.params.songId, 10);

    if (!userId) {
        return res.status(401).json({ message: 'Authentication required.' });
    }
    if (isNaN(songId)) {
        return res.status(400).json({ message: 'Invalid song ID.' });
    }

    try {
        const progress = await UserProgress.find(userId, songId);
        if (!progress) {
            return res.status(200).json({
                userId: userId,
                songId: songId,
                completionStatus: 'not_started',
            });
        }
        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching song progress.', error: error.message });
    }
};

ProgressController.updateSongProgress = async (req, res) => {
    const userId = req.user?.userId;
    const songId = parseInt(req.params.songId, 10);
    const { completionStatus } = req.body;

    if (!userId) {
        return res.status(401).json({ message: 'Authentication required.' });
    }
    if (isNaN(songId)) {
        return res.status(400).json({ message: 'Invalid song ID.' });
    }
    const validStatuses = ['not_started', 'in_progress', 'completed_guided', 'completed_free'];
    if (completionStatus && !validStatuses.includes(completionStatus)) {
        return res.status(400).json({ message: 'Invalid completion status.' });
    }
    try {
        const progressData = { userId, songId };
        if (completionStatus) progressData.completionStatus = completionStatus;

        const updatedProgress = await UserProgress.upsert(progressData);

        res.status(200).json({ message: 'Progress updated successfully.', progress: updatedProgress });
    } catch (error) {
        res.status(500).json({ message: 'Error updating song progress.', error: error.message });
    }
};


module.exports = ProgressController;