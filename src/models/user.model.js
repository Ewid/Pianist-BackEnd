const pool = require('../config/db.config');
const bcrypt = require('bcrypt');

const User = {};

User.create = async (userData) => {
    const { username, password } = userData;
    try {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);


        const sql = 'INSERT INTO Users (username, passwordHash) VALUES (?, ?)';
        const [result] = await pool.query(sql, [username, passwordHash]);
        return { id: result.insertId, username: username };
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            if (error.message.includes("for key 'Users.username'")) {
                 throw new Error('Username already exists.');
            }
        }
        throw error;
    }
};

User.findByUsername = async (username) => {
    try {
        const sql = 'SELECT * FROM Users WHERE username = ?';
        const [rows] = await pool.query(sql, [username]);
        return rows[0];
    } catch (error) {
        throw error;
    }
};


User.findById = async (userId) => {
    try {
        const sql = 'SELECT userId, username, accountStatus, creationDate FROM Users WHERE userId = ?';
        const [rows] = await pool.query(sql, [userId]);
        return rows[0];
    } catch (error) {
        throw error;
    }
};

User.comparePassword = async (candidatePassword, hash) => {
    try {
        return await bcrypt.compare(candidatePassword, hash);
    } catch (error) {
        throw error;
    }
};

module.exports = User;