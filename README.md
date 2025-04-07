# Expense Tracker API

This project is an API for an expense tracker built using Node.js and NestJS. It utilizes Prisma to interact with a PostgreSQL database. The project includes modules for authentication, expense management, and user management. Docker is used to run the project, providing containerization and ease of deployment.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd expense-tracker-api
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

## Running the Project

1. Ensure Docker is installed and running on your machine.

2. Start the Docker containers:
   ```bash
   docker-compose up
   ```

3. The API will be available at `http://localhost:3000`.

## Usage

- Use the API endpoints to manage expenses and users.
- Authentication is required for accessing most endpoints.

## Environment Variables

- `DATABASE_URL`: Connection string for the PostgreSQL database.
- `REFRESH_TOKEN_SECRET`: Secret key for refresh tokens.
- `ACCESS_TOKEN_SECRET`: Secret key for access tokens.
