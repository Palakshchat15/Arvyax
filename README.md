🌿 Secure Wellness Session Platform
This is a full-stack application built for the Arvyax Full Stack Internship Assignment. It allows users to register, log in, and manage wellness sessions, featuring a secure JWT-based authentication system, session drafting with auto-save, and publishing capabilities.

Live Demo
https://arvyax-1.onrender.com/

✨ Core Features
Secure Authentication: JWT-based authentication with password hashing (bcrypt). Users can register, log in, and log out securely.

Session Management: A full CRUD (Create, Read, Update, Delete) system for users to manage their personal wellness sessions.

Draft & Publish System: Sessions can be saved as private drafts before being published for others to see.

Auto-Save: In the session editor, drafts are automatically saved 5 seconds after the user stops typing, preventing data loss.

Protected Routes: Backend API routes and frontend pages are protected, ensuring only authenticated users can access sensitive data and features.

Responsive UI: A clean, modern, and responsive user interface built with React and Tailwind CSS that works on all devices.

🛠️ Tech Stack
Category          Technology

Frontend          React.js, React Router, Axios, Tailwind CSS

Backend           Node.js, Express.js

Database          MongoDB (with Mongoose)

Auth              JSON Web Tokens (JWT), bcrypt.js


🚀 Getting Started
Follow these instructions to get the project running on your local machine.

Prerequisites
Node.js (v14 or higher)

npm (or yarn)

MongoDB Atlas account (or a local MongoDB instance)

1. Clone the Repository

2. Backend Setup
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file 
# See the .env.example section below for details

# Start the backend server
npm start

Your backend will be running at http://localhost:5000.

3. Frontend Setup
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev


Your frontend will open in your browser at http://localhost:5173.

🔑 Environment Variables
To run the backend, you need to create a .env file in the /backend directory.

# Port for the backend server
PORT=5000

# Your MongoDB connection string from Atlas
MONGO_URI

# API Documentation
All private routes require a Bearer <token> in the Authorization header.

Method     Endpoint                      Description                         Access

POST       /api/auth/register            Register a new user.                Public

POST       /api/auth/login               Log in and receive a JWT.           Public

GET        /api/auth/me                  Get the current logged-in user.     Private

GET        /api/sessions                 Get all published sessions.         Private

GET        /api/my-sessions              Get the user's own sessions.        Private

GET        /api/my-sessions/:id          Get a single session by ID.         Private

POST       /api/my-sessions/save-draft   Save or update a session draft.     Private

POST       /api/my-sessions/publish      Publish a session draft.            Private
