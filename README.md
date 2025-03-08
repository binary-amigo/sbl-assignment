# Email Scheduler

This is a simple email scheduler application built with React, Node.js, and PostgreSQL.

## Features

* Schedule emails to be sent at a specific time
* View a list of scheduled emails
* Cancel scheduled emails
* View email logs

## Installation

1. Clone the repository
2. Install dependencies in the frontend folder with `npm install`
3. Install dependencies in the backend folder with `npm install`
4. Start the development server in the frontend folder with `npm run dev`
5. Start the server in the backend folder with `npm run start`
6. Open the application in your web browser at <http://localhost:5172>

## Configuration

The application is configured to use the following:

* A PostgreSQL database with the name `email_scheduler`
* A Node.js server listening on port 3000
* A React application listening on port 5172
* The `VITE_BACKEND_URI` environment variable in the frontend folder is set to `localhost:3000`
* The `.env` file in the backend folder is used to set environment variables for the server. An example of the file is in the `.env.example` file.

