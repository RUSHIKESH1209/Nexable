
# Nexable 

Nexable is a professional social media platform built with the MERN stack, featuring user profiles, connections, posts, real-time messaging, and notifications.

## Features

- User authentication (JWT-based)
- Profile creation (with photo, bio, skills, etc.)
- Connect with other users
- Create, like, and comment on posts
- Real-time chat with Socket.IO (typing + seen status)
- Notifications for connections, messages, likes, comments
- Image uploads via Cloudinary
- Search users dynamically
- Clean and responsive UI (Tailwind CSS + Framer Motion)

## Tech Stack

- **Frontend:** React, Tailwind CSS, Framer Motion, Axios, Vite
- **Backend:** Node.js, Express, MongoDB, Mongoose, Socket.IO
- **Others:** JWT, Cloudinary, dotenv

## Setup Instructions

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```
MONGO_URI=your_mongo_uri
port=your_port
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend:

```bash
npm start
```

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in `/frontend`:

```
VITE_BACKEND_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

## Folder Structure

```
/backend
  /config
  /controllers
  /models
  /routes
  socket.js
  index.js

/frontend
  /src
  /public
  vite.config.js
```

