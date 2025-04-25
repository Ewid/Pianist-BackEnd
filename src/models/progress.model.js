const pool = require('../config/db.config');

const UserProgress = {};

UserProgress.find = async (userId, songId) => {
    try {
        const sql = 'SELECT * FROM UserProgress WHERE userId = ? AND songId = ?';
        const [rows] = await pool.query(sql, [userId, songId]);
        return rows[0];
    } catch (error) {
        throw error;
    }
};

UserProgress.findByUser = async (userId) => {
    try {
        const sql = `
            SELECT up.*, s.title as songTitle, s.difficulty as songDifficulty
            FROM UserProgress up
            JOIN Songs s ON up.songId = s.songId
            WHERE up.userId = ?
            ORDER BY up.lastPlayedTimestamp DESC
        `;
        const [rows] = await pool.query(sql, [userId]);
        return rows;
    } catch (error) {
        throw error;
    }
};

UserProgress.upsert = async (progressData) => {
    const { userId, songId, completionStatus } = progressData;
    try {
        const sql = `
            INSERT INTO UserProgress (userId, songId, completionStatus)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
            completionStatus = VALUES(completionStatus),
            lastPlayedTimestamp = CURRENT_TIMESTAMP
        `;
        const status = completionStatus || 'in_progress';

        const [result] = await pool.query(sql, [userId, songId, status]);

        if (result.insertId > 0 || result.affectedRows > 0) {
            const updatedProgress = await UserProgress.find(userId, songId);
            return updatedProgress;
        } else {
            throw new Error('Failed to create or update user progress.');
        }
    } catch (error) {
        throw error;
    }
};

UserProgress.updateStatus = async (userId, songId, newStatus) => {
    try {
        const sql = 'UPDATE UserProgress SET completionStatus = ? WHERE userId = ? AND songId = ?';
        const [result] = await pool.query(sql, [newStatus, userId, songId]);
        if (result.affectedRows === 0) {
            return null;
        }
        return { message: "Progress status updated successfully." };
    } catch (error) {
        throw error;
    }
};


module.exports = UserProgress;