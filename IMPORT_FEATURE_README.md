# 🤖 AI-Powered Bank Statement Import Feature

## ✅ Feature Complete!

This feature allows users to upload bank statements (CSV/Excel) and automatically import transactions using AI-powered parsing and categorization.

---

## 🎯 Features Implemented

### 1. **AI-Powered Parsing**
- ✅ Supports CSV and Excel (.xlsx, .xls) formats
- ✅ Works with ANY bank format (no templates needed!)
- ✅ Uses GPT-4o-mini for intelligent parsing
- ✅ Automatically detects columns (Date, Description, Debit, Credit, Amount)
- ✅ Handles Indian number formats (₹, commas)
- ✅ Converts dates to standard format

### 2. **Smart Category Suggestions**
- ✅ AI analyzes transaction descriptions
- ✅ Suggests appropriate categories based on Indian context
- ✅ Shows "✨ AI Suggested" badge for suggested categories
- ✅ User can override any suggestion

### 3. **Duplicate Detection**
- ✅ Exact match detection (date + amount + type)
- ✅ Marks duplicates with red badge
- ✅ Auto-deselects duplicates
- ✅ User can force import if needed

### 4. **Review & Edit UI**
- ✅ Clean table view with all transactions
- ✅ Inline category editing
- ✅ Select/deselect individual transactions
- ✅ Bulk select/deselect all
- ✅ Remove unwanted transactions
- ✅ Shows duplicate count and selected count

### 5. **Bulk Import**
- ✅ Save multiple transactions at once
- ✅ Tracks import batches with unique ID
- ✅ Shows success/error messages
- ✅ Skips duplicates automatically

---

## 🚀 Setup Instructions

### Step 1: Add Your OpenAI API Key

1. Open `server/.env` file
2. Replace `your_openai_api_key_here` with your actual OpenAI API key:

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
```

**How to get an API key:**
- Go to https://platform.openai.com/api-keys
- Click "Create new secret key"
- Copy the key and paste it in `.env`

### Step 2: Restart the Server

```bash
cd server
npm run dev
```

The server should restart and connect to OpenAI.

---

## 📖 How to Use

### 1. **Navigate to Import Page**
- Click on "Import" in the sidebar
- Or go to http://localhost:5173/import

### 2. **Upload Bank Statement**
- Select an account from dropdown
- Click "Select File" and choose your CSV/Excel file
- Click "Upload & Parse"

### 3. **Wait for AI Parsing**
- AI will analyze your file (takes 5-10 seconds)
- Transactions will appear in the review table

### 4. **Review Transactions**
- Check AI-suggested categories (marked with ✨)
- Change categories if needed using dropdown
- Deselect any transactions you don't want to import
- Remove transactions using trash icon

### 5. **Save**
- Click "Save Selected (X)" button
- Transactions will be imported to your account
- Success message will appear

---

## 🧪 Testing with Sample Data

A sample CSV file is included: `sample-bank-statement.csv`

**To test:**
1. Go to Import page
2. Select any account
3. Upload `sample-bank-statement.csv`
4. Watch AI parse and categorize 13 transactions
5. Review and save

**Expected Results:**
- SWIGGY/ZOMATO → Food & Dining
- UBER/OLA → Transportation
- AMAZON/FLIPKART → Shopping
- NETFLIX/SPOTIFY → Entertainment
- SALARY CREDIT → Salary (Income)
- FREELANCE PAYMENT → Freelance (Income)
- ELECTRICITY BILL → Bills & Utilities
- HOUSE RENT → Rent
- ATM WITHDRAWAL → Others

---

## 🏗️ Technical Architecture

### Backend

**Files Created:**
- `server/src/services/ai.service.ts` - OpenAI integration
- `server/src/controllers/import.controller.ts` - Import endpoints
- `server/src/routes/import.routes.ts` - Routes with file upload

**API Endpoints:**
- `POST /api/import/parse` - Parse uploaded file with AI
- `POST /api/import/detect-duplicates` - Check for duplicates
- `POST /api/import/save` - Bulk save transactions

**Database Changes:**
- Added `importBatchId` field to Transaction model
- Tracks which transactions came from imports

### Frontend

**Files Created:**
- `client/src/pages/Import.tsx` - Import page UI
- `client/src/services/importService.ts` - API service

**Components Used:**
- File upload with drag & drop support
- Review table with inline editing
- Checkbox for selection
- Select dropdown for categories
- Badges for status indicators

---

## 💰 Cost Estimation

**OpenAI API Costs (GPT-4o-mini):**
- Input: $0.150 per 1M tokens
- Output: $0.600 per 1M tokens

**Typical Usage:**
- Parsing 50 transactions: ~2,000 tokens = $0.001
- Category suggestions (50 txns): ~5,000 tokens = $0.003
- **Total per import: ~$0.004 (less than 1 cent!)**

**Monthly estimate:**
- 100 imports/month = $0.40
- 500 imports/month = $2.00

Very affordable! 💰

---

## 🎨 Supported Bank Formats

The AI can parse ANY bank format, including:

### Indian Banks:
- ✅ HDFC Bank
- ✅ SBI (State Bank of India)
- ✅ ICICI Bank
- ✅ Axis Bank
- ✅ Kotak Mahindra Bank
- ✅ Yes Bank
- ✅ IDFC First Bank
- ✅ And ANY other bank!

### Format Variations:
- ✅ Debit/Credit columns
- ✅ Single Amount column with +/-
- ✅ Different date formats (DD/MM/YYYY, DD-MMM-YY, etc.)
- ✅ Different column names (Narration, Description, Particulars, etc.)
- ✅ Indian number formats (1,50,000.00)

---

## 🔧 Troubleshooting

### Error: "Failed to parse statement with AI"
- **Check:** OpenAI API key is correct in `.env`
- **Check:** Server has internet connection
- **Check:** File format is CSV or Excel

### Error: "No transactions found"
- **Check:** File has actual transaction data
- **Check:** File is not empty or corrupted
- **Try:** Different file or format

### Duplicate Detection Not Working
- **Note:** Duplicates are detected by exact match (date + amount + type)
- **Tip:** If you want to import anyway, you can manually select duplicates

### Categories Not Matching
- **Note:** AI suggestions are based on description analysis
- **Tip:** You can always change the category manually before saving

---

## 🚀 Future Enhancements

Potential improvements:
1. **PDF Support** - Parse PDF bank statements with OCR
2. **Fuzzy Duplicate Detection** - Match similar transactions
3. **Learning from User** - Remember user's category preferences
4. **Auto-Import** - Schedule automatic imports
5. **Bank API Integration** - Direct connection to bank accounts
6. **Multi-Currency** - Support for multiple currencies
7. **Transaction Splitting** - Split one transaction into multiple categories

---

## 📝 Notes

- Import batch IDs are stored for tracking and potential rollback
- Duplicates are auto-deselected but can be manually selected
- All amounts are stored as positive numbers (type determines income/expense)
- AI suggestions are cached per transaction for consistency

---

## 🎉 Enjoy!

You now have a powerful AI-powered import feature that saves hours of manual data entry!

**Questions or issues?** Check the console logs for detailed error messages.

