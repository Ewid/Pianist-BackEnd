require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const dbPool = require('./src/config/db.config');

const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const songRoutes = require('./src/routes/song.routes');
const progressRoutes = require('./src/routes/progress.routes');


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to PianoMasters backend API.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/progress', progressRoutes);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Resource not found.' });
});

app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err.stack || err);

    if (err instanceof require('multer').MulterError) {
        return res.status(400).json({ message: `File Upload Error: ${err.message}`, code: err.code });
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({ message, ...(process.env.NODE_ENV === 'development' && { error: err.stack }) });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        const connection = await dbPool.getConnection();
        console.log('Successfully connected to the database.');
        connection.release();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
            console.log(`API available at http://localhost:${PORT}/api`);
            console.log(`Uploads available at http://localhost:${PORT}/uploads`);
        });
    } catch (error) {
        console.error('Failed to connect to the database. Server not started.', error);
        process.exit(1);
    }
};

startServer();
