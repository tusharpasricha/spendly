# 💰 Spendly - Personal Finance Manager

A modern, AI-powered personal finance management application built with the MERN stack. Track your income, expenses, and get intelligent insights into your spending patterns.

![Tech Stack](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)

## ✨ Features

- 📊 **Statistics Dashboard** - Visual insights into your spending patterns with charts and analytics
- 💳 **Account Management** - Track multiple bank accounts and their balances
- 💸 **Transaction Tracking** - Record and categorize income and expenses
- 🤖 **AI-Powered Import** - Upload bank statements (CSV/Excel) and let AI parse and categorize transactions
- 📈 **Category Analytics** - See spending breakdown by category with pie charts
- 🎨 **Modern UI** - Clean, minimalist design inspired by Vercel
- 🌙 **Dark Mode** - Pure black theme with ultra-subtle borders
- 📱 **Responsive** - Works seamlessly on desktop and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB Atlas account (or local MongoDB)
- OpenAI API key (for AI import feature)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tusharpasricha/spendly.git
   cd spendly
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create `server/.env`:
   ```env
   NODE_ENV=development
   PORT=3001
   MONGODB_URI=your_mongodb_connection_string
   CLIENT_URL=http://localhost:5173
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=1000
   OPENAI_API_KEY=your_openai_api_key
   ```

   Create `client/.env` (optional):
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

   This starts:
   - **Backend** on http://localhost:3001
   - **Frontend** on http://localhost:5173

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS
- **shadcn/ui** - Beautiful UI components
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **date-fns** - Date manipulation
- **Geist Font** - Modern typography

### Backend
- **Node.js** with Express
- **TypeScript** - Type safety
- **MongoDB** with Mongoose
- **OpenAI GPT-4o-mini** - AI-powered parsing
- **Multer** - File uploads
- **Express Validator** - Input validation
- **Helmet** - Security headers
- **CORS** - Cross-origin support

## � Documentation

For detailed documentation, see [DOCS.md](./DOCS.md)

## 🎯 Project Structure

```
spendly/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components (Layout, Sidebar, etc.)
│   │   ├── pages/         # Pages (Stats, Accounts, Transactions, Import)
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
│   └── public/
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic (AI service)
│   │   └── middleware/    # Custom middleware
│   └── .env              # Environment variables (not in Git)
└── package.json          # Workspace configuration
```

## 🔒 Security

⚠️ **Important:** This app is currently designed for **personal use only**. It does not have authentication implemented. See [DOCS.md](./DOCS.md) for security considerations and deployment guidelines.

## 📄 License

MIT © 2024 Spendly

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

Tushar Pasricha - [@tusharpasricha](https://github.com/tusharpasricha)

Project Link: [https://github.com/tusharpasricha/spendly](https://github.com/tusharpasricha/spendly)

---

**Made with ❤️ using the MERN stack**