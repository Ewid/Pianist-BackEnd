const pool = require('../config/db.config');

const Song = {};

Song.findById = async (songId) => {
    try {
        const sql = 'SELECT * FROM Songs WHERE songId = ?';
        const [rows] = await pool.query(sql, [songId]);
        if (rows[0]) {
            try {
                if (rows[0].metadata) rows[0].metadata = JSON.parse(rows[0].metadata);
            } catch (parseError) {}
        }
        return rows[0];
    } catch (error) {
        throw error;
    }
};

Song.findAll = async () => {
    try {
        const sql = 'SELECT * FROM Songs ORDER BY difficulty, title';
        const [rows] = await pool.query(sql);
        rows.forEach(row => {
            try {
                if (row.metadata) row.metadata = JSON.parse(row.metadata);
            } catch (parseError) {}
        });
        return rows;
    } catch (error) {
        throw error;
    }
};

module.exports = Song;