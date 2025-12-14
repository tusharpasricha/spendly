# 📚 Spendly - Complete Documentation

## Table of Contents

1. [Setup & Installation](#setup--installation)
2. [Features](#features)
3. [AI-Powered Import](#ai-powered-import)
4. [API Documentation](#api-documentation)
5. [Security & Deployment](#security--deployment)
6. [Troubleshooting](#troubleshooting)

---

## Setup & Installation

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB Atlas** account (free tier works)
- **OpenAI API key** (for AI import feature)

### Step 1: Install Dependencies

```bash
npm install
```

This installs dependencies for both client and server using npm workspaces.

### Step 2: Configure Environment Variables

#### Server Configuration (`server/.env`)

```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/spendly
CLIENT_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
OPENAI_API_KEY=sk-proj-your-key-here
```

**How to get MongoDB URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Database Access → Add user
4. Network Access → Add IP (0.0.0.0/0 for development)
5. Connect → Drivers → Copy connection string

**How to get OpenAI API key:**
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create new secret key
3. Copy and paste in `.env`

#### Client Configuration (`client/.env`) - Optional

```env
VITE_API_URL=http://localhost:3001/api
```

If not set, defaults to `http://localhost:3001/api`.

### Step 3: Run the Application

**Development mode (both client and server):**
```bash
npm run dev
```

**Run separately:**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

**Access the app:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Health check: http://localhost:3001/health

### Step 4: Build for Production

```bash
# Build both
npm run build

# Build separately
npm run client:build
npm run server:build
```

---

## Features

### 1. Statistics Dashboard

**Location:** `/` (Home page)

**Features:**
- Period selector (Weekly, Monthly, Yearly)
- Period navigation with arrows
- Income/Expense tabs with totals
- Category breakdown pie chart
- Clickable category list
- Transaction drill-down by category

**How to use:**
1. Select period (Weekly/Monthly/Yearly)
2. Navigate between periods using arrows
3. Switch between Income/Expense tabs
4. Click on a category to see transactions
5. Click "Back to Categories" to return

### 2. Account Management

**Location:** `/accounts`

**Features:**
- View all accounts
- Total balance across accounts
- Add new accounts
- Edit existing accounts
- Delete accounts (if no transactions)

**How to use:**
1. Click "Add Account" button
2. Enter account name, initial balance, description
3. Click "Save"
4. Edit/Delete using buttons on each card

### 3. Transaction Tracking

**Location:** `/transactions`

**Features:**
- Daily, Weekly, Monthly views
- Calendar view for specific dates
- Add income/expense transactions
- Edit/Delete transactions
- Category and account filtering
- Date-based organization

**How to use:**
1. Click "Add Transaction" button
2. Fill in date, amount, type (income/expense)
3. Select category and account
4. Add optional note
5. Click "Save"

### 4. AI-Powered Import

**Location:** `/import`

See [AI-Powered Import](#ai-powered-import) section below.

---

## AI-Powered Import

### Overview

Upload bank statements (CSV/Excel) and let AI automatically parse and categorize transactions.

### Supported Formats

- **CSV** (.csv)
- **Excel** (.xlsx, .xls)
- **Any bank format** (HDFC, SBI, ICICI, Axis, Kotak, etc.)

### How It Works

1. **Upload** - Select account and upload file
2. **AI Parsing** - GPT-4o-mini analyzes the file
3. **Smart Detection** - Finds date, amount, description columns
4. **Categorization** - AI suggests categories based on description
5. **Duplicate Check** - Detects existing transactions
6. **Review** - Edit categories, select transactions
7. **Import** - Save selected transactions

### Step-by-Step Guide

1. **Navigate to Import page**
   - Click "Import" in sidebar

2. **Select Account**
   - Choose which account these transactions belong to

3. **Upload File**
   - Click "Select File"
   - Choose CSV or Excel file
   - Max size: 10MB

4. **Click "Upload & Parse"**
   - Wait 5-10 seconds for AI processing
   - Transactions appear in review table

5. **Review Transactions**
   - ✨ = AI suggested category
   - 🔴 Duplicate badge = Already exists
   - Change categories using dropdown
   - Change type (income/expense) if needed
   - Deselect unwanted transactions
   - Remove transactions using trash icon

6. **Save**
   - Click "Save Selected (X)" button
   - Success message appears
   - Go to Transactions page to verify

### Cost Estimation

**OpenAI API Costs (GPT-4o-mini):**
- ~$0.004 per import (50 transactions)
- 100 imports/month = $0.40
- 500 imports/month = $2.00

Very affordable! 💰

### Troubleshooting Import

**Error: "Failed to parse statement with AI"**
- Check OpenAI API key in `server/.env`
- Verify server has internet connection
- Check file format (CSV/Excel only)

**Error: "No transactions found"**
- File might be empty or corrupted
- Try different file format
- Check if file has header row

**Duplicates not detected**
- Duplicates match by: date + amount + type
- Slight differences won't be detected
- You can manually deselect duplicates

---

## API Documentation

### Base URL

```
http://localhost:3001/api
```

### Endpoints

#### Accounts

```
GET    /api/accounts              - Get all accounts
POST   /api/accounts              - Create account
GET    /api/accounts/:id          - Get account by ID
PUT    /api/accounts/:id          - Update account
DELETE /api/accounts/:id          - Delete account
GET    /api/accounts/total-balance - Get total balance
```

#### Transactions

```
GET    /api/transactions          - Get all transactions
POST   /api/transactions          - Create transaction
GET    /api/transactions/:id      - Get transaction by ID
PUT    /api/transactions/:id      - Update transaction
DELETE /api/transactions/:id      - Delete transaction
```

#### Categories

```
GET    /api/categories            - Get all categories
POST   /api/categories            - Create category
GET    /api/categories/:id        - Get category by ID
PUT    /api/categories/:id        - Update category
DELETE /api/categories/:id        - Delete category
```

#### Statistics

```
GET    /api/stats                 - Get statistics
  Query params:
    - startDate: ISO date string
    - endDate: ISO date string
    - period: 'weekly' | 'monthly' | 'yearly'
```

#### Import

```
POST   /api/import/parse          - Parse uploaded file with AI
POST   /api/import/detect-duplicates - Check for duplicates
POST   /api/import/save           - Bulk save transactions
```

---

## Security & Deployment

### ⚠️ Security Warning

**This app does NOT have authentication!**

**Current state:**
- ✅ Good for personal use (single user)
- ❌ NOT suitable for multi-user deployment
- ❌ No user isolation
- ❌ No access control

### For Personal Use Deployment

**Frontend (Vercel):**
1. Push code to GitHub
2. Import to Vercel
3. Set environment variable: `VITE_API_URL=your-backend-url`
4. Deploy

**Backend (Railway/Render):**
1. Create new project
2. Connect GitHub repo
3. Set environment variables (see server/.env.example)
4. Deploy

**Important:**
- Rotate MongoDB password before deployment
- Regenerate OpenAI API key
- Set `RATE_LIMIT_MAX_REQUESTS=100` (not 100000!)
- Use Vercel password protection for privacy

### For Multi-User Production

**Required changes:**
1. Implement JWT authentication
2. Add User model with password hashing
3. Add `userId` to all models
4. Protect all routes with auth middleware
5. Add login/register pages
6. Implement session management

See `SECURITY_AUDIT.md` (if exists) for detailed security analysis.

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### MongoDB Connection Error

- Check `MONGODB_URI` in `server/.env`
- Verify MongoDB Atlas IP whitelist (0.0.0.0/0)
- Check username/password in connection string
- Ensure cluster is running

### Module Not Found

```bash
# Clean install
rm -rf node_modules client/node_modules server/node_modules
npm install
```

### Build Errors

```bash
# TypeScript errors
npm run build

# If errors persist, check:
# - All imports are correct
# - No unused variables
# - Types are properly defined
```

### CORS Errors

- Check `CLIENT_URL` in `server/.env`
- Verify CORS configuration in `server/src/server.ts`
- For production, add your Vercel URL to allowed origins

### AI Import Not Working

- Verify `OPENAI_API_KEY` in `server/.env`
- Check OpenAI account has credits
- Test with sample CSV file
- Check server console for errors

---

## Database Schema

### Account Model

```typescript
{
  name: string;
  balance: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Transaction Model

```typescript
{
  date: Date;
  amount: number;
  type: 'income' | 'expense';
  category: ObjectId (ref: Category);
  account: ObjectId (ref: Account);
  note?: string;
  importBatchId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Category Model

```typescript
{
  name: string;
  type: 'income' | 'expense';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Development Tips

### Hot Reload

Both client and server support hot reload:
- Client: Vite HMR (instant)
- Server: Nodemon (restarts on file change)

### Debugging

**Frontend:**
- Use React DevTools
- Check browser console
- Network tab for API calls

**Backend:**
- Check terminal logs
- Add `console.log()` statements
- Use Postman for API testing

### Code Style

- TypeScript strict mode enabled
- ESLint for linting
- Prettier for formatting (if configured)

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## License

MIT © 2024 Spendly

---

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review console logs for errors

---

**Happy tracking! 💰**

