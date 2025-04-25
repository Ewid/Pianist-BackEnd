const Song = require('../models/song.model');
const UserProgress = require('../models/progress.model');

const SongController = {};

SongController.getAccessibleSongs = async (req, res) => {
    const userSkillLevel = req.user?.skillLevel || 1;
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    try {
        const allSongs = await Song.findAll();
        const userProgress = await UserProgress.findByUser(userId);
        const progressMap = new Map(userProgress.map(p => [p.songId, p]));

        const accessibleSongs = allSongs.map(song => {
            const progress = progressMap.get(song.songId);
            const isUnlocked = song.difficulty <= userSkillLevel;
            const isGuidedModeCompleted = progress?.completionStatus === 'completed_guided' || progress?.completionStatus === 'completed_free';
            const isFreeModeUnlocked = isGuidedModeCompleted;

            return {
                ...song,
                isUnlocked: isUnlocked,
                completionStatus: progress?.completionStatus || 'not_started',
                isFreeModeUnlocked: isFreeModeUnlocked
            };
        });

        res.status(200).json(accessibleSongs);

    } catch (error) {
        res.status(500).json({ message: 'Error fetching songs.', error: error.message });
    }
};

SongController.getSongById = async (req, res) => {
    const songId = parseInt(req.params.id, 10);
    const userId = req.user?.userId;
    const userSkillLevel = req.user?.skillLevel || 1;

     if (!userId) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    if (isNaN(songId)) {
        return res.status(400).json({ message: 'Invalid song ID.' });
    }

    try {
        const song = await Song.findById(songId);
        if (!song) {
            return res.status(404).json({ message: 'Song not found.' });
        }

        const progress = await UserProgress.find(userId, songId);
        const isUnlocked = song.difficulty <= userSkillLevel;
        const isGuidedModeCompleted = progress?.completionStatus === 'completed_guided' || progress?.completionStatus === 'completed_free';
        const isFreeModeUnlocked = isGuidedModeCompleted;

        const songDetails = {
             ...song,
             isUnlocked: isUnlocked,
             completionStatus: progress?.completionStatus || 'not_started',
             isFreeModeUnlocked: isFreeModeUnlocked
        };

        res.status(200).json(songDetails);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching song details.', error: error.message });
    }
};

module.exports = SongController;