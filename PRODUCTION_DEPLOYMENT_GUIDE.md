# 🚀 Production Deployment Guide

## ⚠️ CRITICAL: Read SECURITY_AUDIT.md First!

This app is **NOT production-ready** without implementing authentication. However, if you want to deploy it for **personal use only** (single user), here's how to do it safely.

---

## 🎯 Option 1: Personal Use Deployment (Single User)

If you're the only user and want to deploy quickly:

### Step 1: Secure Your Secrets

1. **Rotate MongoDB Password:**
   ```bash
   # Go to MongoDB Atlas
   # Database Access → Edit User → Change Password
   # Update MONGODB_URI in production environment
   ```

2. **Regenerate OpenAI API Key:**
   ```bash
   # Go to platform.openai.com/api-keys
   # Revoke old key
   # Create new key
   # Update OPENAI_API_KEY in production environment
   ```

3. **Never commit .env file:**
   ```bash
   # Verify it's in .gitignore
   git status
   # Should NOT show server/.env
   ```

### Step 2: Fix Rate Limiting

Update `server/.env`:
```env
RATE_LIMIT_MAX_REQUESTS=100  # Change from 100000 to 100
```

### Step 3: Add Request Size Limits

Edit `server/src/server.ts`:
```typescript
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
```

### Step 4: Deploy to Vercel/Railway/Render

**Vercel (Recommended for Frontend):**
```bash
cd client
npm run build
# Deploy to Vercel
```

**Railway/Render (Recommended for Backend):**
```bash
cd server
# Set environment variables in dashboard:
# - NODE_ENV=production
# - MONGODB_URI=your_new_connection_string
# - OPENAI_API_KEY=your_new_key
# - CLIENT_URL=https://your-frontend-url.vercel.app
# - RATE_LIMIT_MAX_REQUESTS=100
```

### Step 5: Restrict Access

**Option A: Use Vercel Password Protection**
- Enable password protection in Vercel dashboard
- Only you can access the app

**Option B: Use IP Whitelisting**
- Configure your hosting provider to only allow your IP
- Block all other traffic

**Option C: Use Basic Auth**
- Add simple HTTP Basic Auth middleware
- Not secure for multi-user, but OK for personal use

---

## 🏢 Option 2: Multi-User Production Deployment

For a real production app with multiple users, you MUST implement authentication.

### Required Changes:

#### 1. Add User Model

Create `server/src/models/User.model.ts`:
```typescript
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  name: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
```

#### 2. Add Auth Middleware

Create `server/src/middleware/auth.ts`:
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```

#### 3. Update All Models

Add `userId` field to Account, Transaction, Category:
```typescript
// In each model schema
userId: {
  type: Schema.Types.ObjectId,
  ref: 'User',
  required: true,
}
```

#### 4. Protect All Routes

```typescript
// In server.ts
import { authenticate } from './middleware/auth';

app.use('/api/accounts', authenticate, accountRoutes);
app.use('/api/transactions', authenticate, transactionRoutes);
app.use('/api/categories', authenticate, categoryRoutes);
app.use('/api/stats', authenticate, statsRoutes);
app.use('/api/import', authenticate, importRoutes);
```

#### 5. Add Auth Routes

Create login, register, logout endpoints.

#### 6. Update Frontend

- Add login/register pages
- Store JWT token in localStorage
- Add token to all API requests
- Handle token expiration

---

## 🔐 Environment Variables for Production

### Backend (.env):
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://NEW_USER:NEW_PASSWORD@cluster.mongodb.net/spendly
CLIENT_URL=https://your-app.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
OPENAI_API_KEY=sk-proj-NEW_KEY_HERE
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
```

### Frontend (.env):
```env
VITE_API_URL=https://your-backend.railway.app/api
```

---

## 📊 Monitoring & Alerts

1. **Set up OpenAI usage alerts:**
   - Go to platform.openai.com
   - Set monthly budget limit ($10-50)
   - Enable email alerts

2. **Monitor MongoDB:**
   - Set up Atlas alerts for connection spikes
   - Monitor storage usage

3. **Add error tracking:**
   ```bash
   npm install @sentry/node @sentry/react
   ```

---

## ✅ Pre-Deployment Checklist

- [ ] All secrets rotated
- [ ] Rate limit reduced to 100
- [ ] Request size limits added
- [ ] NODE_ENV=production
- [ ] HTTPS enabled
- [ ] CORS configured for production domain
- [ ] Database backups enabled
- [ ] OpenAI budget alerts set
- [ ] Error monitoring configured
- [ ] Authentication implemented (for multi-user)

---

## 🎯 Recommended Deployment Stack

**For Personal Use:**
- Frontend: Vercel (free tier)
- Backend: Railway (free tier with credit card)
- Database: MongoDB Atlas (free tier)
- Total Cost: $0-5/month

**For Production (Multi-User):**
- Frontend: Vercel Pro ($20/month)
- Backend: Railway Pro ($5-20/month)
- Database: MongoDB Atlas M10 ($57/month)
- Monitoring: Sentry ($26/month)
- Total Cost: $100-150/month

---

## 🚨 Final Warning

**DO NOT deploy without:**
1. Rotating all secrets
2. Reducing rate limit
3. Adding authentication (for multi-user)

**Your current .env file has exposed credentials. Rotate them NOW!**

