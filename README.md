# MERN Stack Application

A modern, scalable MERN (MongoDB, Express, React, Node.js) application with TypeScript support.

## 🏗️ Project Structure

```
mern-application/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom React hooks
│   │   ├── context/       # React Context providers
│   │   ├── utils/         # Utility functions
│   │   ├── types/         # TypeScript types
│   │   └── assets/        # Static assets
│   └── public/            # Public assets
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utility functions
│   │   ├── config/        # Configuration files
│   │   └── types/         # TypeScript types
│   └── tests/             # Server tests
└── docker-compose.yml     # Docker configuration

```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB (or use Docker)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both `client` and `server` directories
   - Update the variables with your configuration

### Development

Run both client and server concurrently:
```bash
npm run dev
```

Or run them separately:
```bash
npm run server:dev  # Start server on http://localhost:5000
npm run client:dev  # Start client on http://localhost:5173
```

### Using Docker

```bash
docker-compose up
```

### Building for Production

```bash
npm run build
```

## 📝 Available Scripts

- `npm run dev` - Run both client and server in development mode
- `npm run build` - Build both client and server for production
- `npm run test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- Axios
- TailwindCSS (optional)

### Backend
- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- Express Validator
- Helmet & CORS for security

## 📦 Features

- ✅ TypeScript support
- ✅ Monorepo structure with workspaces
- ✅ Docker support
- ✅ Environment-based configuration
- ✅ ESLint & Prettier setup
- ✅ API error handling
- ✅ Request validation
- ✅ CORS configuration
- ✅ Security best practices
- ✅ RESTful API with CRUD operations

## 📄 License

MIT

