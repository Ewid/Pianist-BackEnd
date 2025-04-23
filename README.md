# PianoMasters Backend

Backend API server for the PianoMasters Unity game.

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Pianist-BackEnd
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    *   Create a `.env` file in the root directory.
    *   Copy the contents of `.env.example` (if provided) or add the following variables, replacing the placeholders with your actual values:
        ```dotenv
        PORT=3000

        # MySQL Database Configuration
        DB_HOST=localhost
        DB_USER=your_db_user
        DB_PASSWORD=your_db_password
        DB_NAME=pianomasters_db

        # JWT Configuration
        JWT_SECRET=your_very_secure_jwt_secret_key
        JWT_EXPIRES_IN=1h
        ```

4.  **Set up the MySQL database:**
    *   Ensure you have MySQL server installed and running.
    *   Create the database specified in `DB_NAME`.
    *   Run the database schema migrations (details TBD, likely using a `schema.sql` file or migration tool).
        ```bash
        # Example using mysql client:
        # mysql -u your_db_user -p < schema.sql
        ```

5.  **Start the server:**
    ```bash
    npm start 
    # Or for development with nodemon (if installed):
    # npm run dev
    ```

The server should now be running on `http://localhost:3000` (or the port specified in `.env`).

## API Endpoints

(Documentation for API endpoints will be added here)

*   `/api/auth`
*   `/api/users`
*   `/api/songs`
*   `/api/progress`
*   `/api/performances`
*   `/api/achievements`
