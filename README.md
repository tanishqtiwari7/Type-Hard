# Type-Hard

Type-Hard is a full-stack typing game with user accounts, live multiplayer, and leaderboards. The frontend is a React + Vite app and the backend is a Node.js + Express API with PostgreSQL.

## Features

- Single-player typing tests and stats
- Multiplayer rooms over WebSocket
- Leaderboards and profiles
- Auth flow with password reset and verification

## Tech Stack

- Client: React, Vite, Tailwind CSS, Zustand, Socket.IO
- Server: Node.js, Express, PostgreSQL, Socket.IO

## Project Structure

```
client/   # React + Vite frontend
server/   # Node.js API and realtime services
```

## Prerequisites

- Node.js 18+ (recommended)
- PostgreSQL 14+ (or a compatible hosted instance)

## Setup

1. Install dependencies for both apps:

   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

2. Create the server environment file:

   ```bash
   cd server
   copy .env.example .env
   ```

   Update values as needed (see below).

3. Initialize the database (example):
   - Create a PostgreSQL database named `typehard`.
   - Run the SQL in `server/src/models/schema.sql`.

## Environment Variables (Server)

Defined in `server/.env`:

- `PORT` - API port (default: 5000)
- `CLIENT_URL` - frontend URL (default: http://localhost:5173)
- `NODE_ENV` - environment name
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - secret for signing JWTs

## Running Locally

Start the server:

```bash
cd server
npm run dev
```

Start the client:

```bash
cd client
npm run dev
```

Open the app at http://localhost:5173.

## Scripts

### Client

- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run lint` - lint client code
- `npm run preview` - preview production build

### Server

- `npm run dev` - start API with nodemon
- `npm start` - start API

## Notes

- Socket.IO is used for realtime multiplayer features.
- Update CORS and environment settings if you deploy to another domain.
