import OpenAI from 'openai';

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

export interface ParsedTransaction {
  date: string; // YYYY-MM-DD format
  description: string;
  amount: number;
  type: 'income' | 'expense';
}

/**
 * Parse bank statement using AI
 * Supports CSV, Excel, and text formats
 */
export async function parseStatementWithAI(
  fileContent: string,
  fileName: string
): Promise<ParsedTransaction[]> {
  const prompt = `You are a bank statement parser. Extract ALL transactions from this bank statement.

RULES:
1. Identify columns: Date, Description/Narration, Debit, Credit, Balance
2. Determine if Debit/Credit or single Amount column with +/- 
3. Parse dates in any format (DD/MM/YYYY, DD-MMM-YY, YYYY-MM-DD, etc.) and convert to YYYY-MM-DD
4. Extract transaction description/narration (clean and concise)
5. Identify if transaction is INCOME (credit/positive/deposit) or EXPENSE (debit/negative/withdrawal)
6. Handle Indian number formats (₹, commas: 1,50,000.00)
7. Ignore header rows, footer rows, and summary rows
8. Only extract actual transaction rows

Return ONLY valid JSON array, no markdown, no explanation:
[
  {
    "date": "YYYY-MM-DD",
    "description": "string",
    "amount": number (positive, no commas),
    "type": "income" | "expense"
  }
]

File name: ${fileName}

Bank statement data:
${fileContent}
`;

  try {
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a precise bank statement parser. Return only valid JSON arrays.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.1, // Low temperature for consistent parsing
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    const parsed = JSON.parse(content);
    
    // Handle both direct array and object with transactions key
    const transactions = Array.isArray(parsed) ? parsed : parsed.transactions || [];
    
    return transactions;
  } catch (error) {
    console.error('AI parsing error:', error);
    throw new Error('Failed to parse statement with AI');
  }
}

/**
 * Suggest category for a transaction using AI
 */
export async function suggestCategoryWithAI(
  description: string,
  amount: number,
  type: 'income' | 'expense',
  availableCategories: { name: string; type: string }[]
): Promise<string> {
  const incomeCategories = availableCategories
    .filter((c) => c.type === 'income' || c.type === 'both')
    .map((c) => c.name);
  
  const expenseCategories = availableCategories
    .filter((c) => c.type === 'expense' || c.type === 'both')
    .map((c) => c.name);

  const categories = type === 'income' ? incomeCategories : expenseCategories;

  const prompt = `You are a financial transaction categorizer for an Indian user.

Available categories for ${type.toUpperCase()}:
${categories.join(', ')}

Analyze this transaction and suggest the MOST appropriate category:
- Description: "${description}"
- Amount: ₹${amount}
- Type: ${type}

Consider Indian context:
- SWIGGY/ZOMATO/FOOD → Food & Dining
- UBER/OLA/RAPIDO → Transportation  
- AMAZON/FLIPKART/MYNTRA → Shopping
- NETFLIX/SPOTIFY/PRIME → Entertainment
- SALARY CREDIT/PAYROLL → Salary
- ATM WDL/CASH → Cash Withdrawal
- UPI payments → analyze merchant name
- RENT/HOUSE RENT → Rent
- ELECTRICITY/WATER/GAS → Bills & Utilities
- INSURANCE PREMIUM → Insurance
- EMI/LOAN → EMI

Return ONLY the category name from the available list, nothing else. No explanation, no punctuation.
`;

  try {
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a precise categorizer. Return only the category name.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 50,
    });

    const suggestedCategory = response.choices[0].message.content?.trim() || '';
    
    // Validate that the suggested category exists in available categories
    if (categories.includes(suggestedCategory)) {
      return suggestedCategory;
    }
    
    // Fallback to "Others" if category not found
    return type === 'income' ? 'Other Income' : 'Others';
  } catch (error) {
    console.error('AI category suggestion error:', error);
    // Fallback to default category
    return type === 'income' ? 'Other Income' : 'Others';
  }
}

