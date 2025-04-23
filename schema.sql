-- Users Table
CREATE TABLE IF NOT EXISTS Users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE, 
    passwordHash VARCHAR(255) NOT NULL,
    skillLevel INT DEFAULT 1,
    accountStatus ENUM('active', 'inactive', 'banned') DEFAULT 'active',
    creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Song Tables
CREATE TABLE IF NOT EXISTS Songs (
    songId INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255),
    difficulty INT NOT NULL,
    category VARCHAR(100),
    filePath VARCHAR(512) NOT NULL,
    metadata TEXT,
    INDEX(difficulty),
    INDEX(category)
);

-- User Progress Table
CREATE TABLE IF NOT EXISTS UserProgress (
    progressId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    songId INT NOT NULL,
    completionStatus ENUM('not_started', 'in_progress', 'completed_guided', 'completed_free') DEFAULT 'not_started',
    accuracyScore DECIMAL(5, 2) DEFAULT 0.00,
    lastPlayedTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    FOREIGN KEY (songId) REFERENCES Songs(songId) ON DELETE CASCADE,
    UNIQUE KEY user_song_progress (userId, songId)
);