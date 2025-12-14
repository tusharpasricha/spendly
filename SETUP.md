# MERN Application Setup Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB** (local installation or MongoDB Atlas account)
- **Docker** (optional, for containerized deployment)

## 🚀 Quick Start

### 1. Install Dependencies

Install all dependencies for both client and server:

```bash
npm install
```

This will install dependencies for the root workspace, client, and server.

### 2. Environment Configuration

#### Server Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern_app
CLIENT_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Client Environment Variables

Create a `.env` file in the `client` directory:

```bash
cd client
cp .env.example .env
```

Update the `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# macOS (using Homebrew)
brew services start mongodb-community

# Linux (systemd)
sudo systemctl start mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

### 4. Run the Application

#### Development Mode (Recommended)

Run both client and server concurrently:

```bash
npm run dev
```

This will start:
- **Server** on http://localhost:5000
- **Client** on http://localhost:5173

#### Run Separately

Run server only:
```bash
npm run server:dev
```

Run client only:
```bash
npm run client:dev
```

### 5. Verify Installation

- Open http://localhost:5173 in your browser
- You should see the MERN application homepage
- Check http://localhost:5000/health for server health status

## 🐳 Docker Setup

### Using Docker Compose

Run the entire stack (MongoDB, Server, Client) with Docker:

```bash
docker-compose up
```

This will start:
- MongoDB on port 27017
- Server on port 5000
- Client on port 5173

To run in detached mode:
```bash
docker-compose up -d
```

To stop:
```bash
docker-compose down
```

## 📦 Building for Production

### Build Both Client and Server

```bash
npm run build
```

### Build Separately

```bash
# Build server
npm run server:build

# Build client
npm run client:build
```

### Run Production Build

```bash
# Server
cd server
npm start

# Client (serve the dist folder with a static server)
cd client
npm run preview
```

## 🧪 Testing

Run tests for both client and server:

```bash
npm test
```

## 🔍 Linting and Formatting

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## 📁 Project Structure

```
mern-application/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── App.tsx        # Main app component
│   └── package.json
├── server/                # Node.js backend
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Utility functions
│   │   └── server.ts      # Server entry point
│   └── package.json
├── docker-compose.yml     # Docker configuration
├── package.json           # Root package.json
└── README.md

```

## 🛠️ Available Scripts

### Root Level
- `npm run dev` - Run both client and server
- `npm run build` - Build both client and server
- `npm test` - Run all tests
- `npm run lint` - Lint all code
- `npm run format` - Format all code

### Server
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm test` - Run tests

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔧 Troubleshooting

### Port Already in Use

If ports 5000 or 5173 are already in use, update the PORT in `.env` files.

### MongoDB Connection Error

Ensure MongoDB is running and the connection string in `.env` is correct.

### Module Not Found Errors

Delete `node_modules` and reinstall:

```bash
rm -rf node_modules client/node_modules server/node_modules
npm install
```

## 📚 Next Steps

1. Customize the Item model in `server/src/models/Item.model.ts`
2. Add more routes and controllers as needed
3. Create additional React components and pages
4. Add form validation and error handling
5. Implement pagination for large datasets
6. Add unit and integration tests

## 📄 License

MIT

