import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Loader2, Upload, FileText, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { importService } from '@/services/importService';
import { accountService } from '@/services/accountService';
import { categoryService } from '@/services/categoryService';
import type { Account, Category } from '@/types';
import { format } from 'date-fns';

interface ParsedTransaction {
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  suggestedCategory: string;
  isDuplicate?: boolean;
  duplicateId?: string;
}

interface TransactionRow extends ParsedTransaction {
  id: string;
  selected: boolean;
  category: string;
  accountId: string;
}

interface TransactionReviewRowProps {
  transaction: TransactionRow;
  categories: Category[];
  onSelectChange: (id: string, checked: boolean) => void;
  onCategoryChange: (id: string, category: string) => void;
  onTypeChange: (id: string, type: 'income' | 'expense') => void;
  onRemove: (id: string) => void;
}

function TransactionReviewRow({
  transaction,
  categories,
  onSelectChange,
  onCategoryChange,
  onTypeChange,
  onRemove,
}: TransactionReviewRowProps) {
  const typeCategories = categories.filter(
    (c) => c.type === transaction.type || c.type === 'both'
  );

  return (
    <div
      className={`flex items-center gap-3 p-3 border rounded-md ${
        transaction.isDuplicate ? 'bg-destructive/5 border-destructive/20' : 'border-subtle'
      }`}
    >
      <Checkbox
        checked={transaction.selected}
        onCheckedChange={(checked) => onSelectChange(transaction.id, checked as boolean)}
        disabled={transaction.isDuplicate}
      />

      <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-2 items-center">
        <div className="text-xs">
          <div className="font-medium">{format(new Date(transaction.date), 'dd MMM yyyy')}</div>
          <div className="text-muted-foreground truncate">{transaction.description}</div>
        </div>

        <div className="text-xs">
          <div
            className={`font-semibold ${
              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            ₹{transaction.amount.toFixed(2)}
          </div>
        </div>

        <div>
          <Select
            value={transaction.type}
            onValueChange={(value) => onTypeChange(transaction.id, value as 'income' | 'expense')}
            disabled={transaction.isDuplicate}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income" className="text-xs">
                <span className="text-green-600">Income</span>
              </SelectItem>
              <SelectItem value="expense" className="text-xs">
                <span className="text-red-600">Expense</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <Select
            value={transaction.category}
            onValueChange={(value) => onCategoryChange(transaction.id, value)}
            disabled={transaction.isDuplicate}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {typeCategories.map((cat) => (
                <SelectItem key={cat._id} value={cat.name} className="text-xs">
                  {cat.name}
                  {cat.name === transaction.suggestedCategory && (
                    <span className="ml-1.5 text-[10px] text-green-600">✨ AI Suggested</span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 justify-end">
          {transaction.isDuplicate && (
            <Badge variant="destructive" className="text-[10px] h-4">
              Duplicate
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(transaction.id)}
            className="h-7 w-7 p-0"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function Import() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchAccountsAndCategories();
  }, []);

  const fetchAccountsAndCategories = async () => {
    try {
      const [accountsRes, categoriesRes] = await Promise.all([
        accountService.getAccounts(),
        categoryService.getCategories(),
      ]);
      setAccounts(accountsRes.data?.data?.accounts || []);
      setCategories(categoriesRes.data?.data?.categories || []);
      
      // Set first account as default
      if (accountsRes.data?.data?.accounts?.length > 0) {
        setSelectedAccount(accountsRes.data.data.accounts[0]._id);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setSuccess(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    if (!selectedAccount) {
      setError('Please select an account');
      return;
    }

    try {
      setParsing(true);
      setError(null);
      setSuccess(null);

      // Step 1: Parse the file with AI
      const parseRes = await importService.parseStatement(file);
      const parsedTransactions = parseRes.data?.data?.transactions || [];

      if (parsedTransactions.length === 0) {
        setError('No transactions found in the file');
        setParsing(false);
        return;
      }

      // Step 2: Detect duplicates
      const duplicateRes = await importService.detectDuplicates(parsedTransactions);
      const transactionsWithDuplicates = duplicateRes.data?.data?.transactions || [];

      // Step 3: Prepare transactions for review
      const reviewTransactions: TransactionRow[] = transactionsWithDuplicates.map(
        (txn: ParsedTransaction, index: number) => ({
          ...txn,
          id: `txn-${index}`,
          selected: !txn.isDuplicate, // Auto-select non-duplicates
          category: txn.suggestedCategory,
          accountId: selectedAccount,
        })
      );

      setTransactions(reviewTransactions);
      setParsing(false);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to parse file');
      setParsing(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setTransactions((prev) =>
      prev.map((txn) => ({
        ...txn,
        selected: txn.isDuplicate ? false : checked,
      }))
    );
  };

  const handleSelectTransaction = (id: string, checked: boolean) => {
    setTransactions((prev) =>
      prev.map((txn) => (txn.id === id ? { ...txn, selected: checked } : txn))
    );
  };

  const handleCategoryChange = (id: string, category: string) => {
    setTransactions((prev) =>
      prev.map((txn) => (txn.id === id ? { ...txn, category } : txn))
    );
  };

  const handleTypeChange = (id: string, type: 'income' | 'expense') => {
    setTransactions((prev) =>
      prev.map((txn) => {
        if (txn.id === id) {
          // When type changes, check if current category is valid for new type
          const currentCategory = categories.find(c => c.name === txn.category);
          const isValidCategory = currentCategory && (currentCategory.type === type || currentCategory.type === 'both');

          // If category is not valid for new type, reset to first valid category
          if (!isValidCategory) {
            const validCategory = categories.find(c => c.type === type || c.type === 'both');
            return { ...txn, type, category: validCategory?.name || txn.category };
          }

          return { ...txn, type };
        }
        return txn;
      })
    );
  };

  const handleRemoveTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((txn) => txn.id !== id));
  };

  const handleSave = async () => {
    const selectedTransactions = transactions.filter((txn) => txn.selected);

    if (selectedTransactions.length === 0) {
      setError('No transactions selected');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const result = await importService.bulkSaveTransactions(
        selectedTransactions,
        selectedAccount
      );

      const importedCount = result.data?.data?.importedCount || 0;
      setSuccess(`Successfully imported ${importedCount} transactions!`);
      
      // Clear transactions after successful import
      setTransactions([]);
      setFile(null);
      setSaving(false);
    } catch (err: any) {
      console.error('Save error:', err);
      setError(err.response?.data?.message || 'Failed to save transactions');
      setSaving(false);
    }
  };

  const selectedCount = transactions.filter((txn) => txn.selected).length;
  const duplicateCount = transactions.filter((txn) => txn.isDuplicate).length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Import Transactions</h1>
        <p className="text-xs text-muted-foreground">
          Upload your bank statement (CSV/Excel) and let AI parse it for you
        </p>
      </div>

      {/* Upload Section */}
      <Card className="border-subtle">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Upload Bank Statement</CardTitle>
          <CardDescription className="text-xs">
            Supported formats: CSV, Excel (.xlsx, .xls)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium mb-1.5 block">Select Account</label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Choose account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account._id} value={account._id} className="text-xs">
                      {account.name} (₹{account.balance.toFixed(2)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium mb-1.5 block">Select File</label>
              <Input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="h-9 text-xs"
              />
            </div>
          </div>

          {file && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs flex-1">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!file || !selectedAccount || parsing}
            className="w-full h-9 text-xs"
          >
            {parsing ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                Parsing with AI...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-3.5 w-3.5" />
                Upload & Parse
              </>
            )}
          </Button>

          {error && (
            <div className="flex items-center gap-2 p-2 bg-destructive/10 border border-destructive/20 rounded-md">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-xs text-destructive">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-2 bg-green-500/10 border border-green-500/20 rounded-md">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-xs text-green-600">{success}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Section */}
      {transactions.length > 0 && (
        <Card className="border-subtle">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">Review Transactions</CardTitle>
                <CardDescription className="text-xs">
                  {transactions.length} found, {duplicateCount} duplicates, {selectedCount} selected
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectAll(true)}
                  className="h-7 text-xs"
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectAll(false)}
                  className="h-7 text-xs"
                >
                  Deselect All
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={selectedCount === 0 || saving}
                  size="sm"
                  className="h-7 text-xs"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>Save Selected ({selectedCount})</>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {transactions.map((txn) => (
                <TransactionReviewRow
                  key={txn.id}
                  transaction={txn}
                  categories={categories}
                  onSelectChange={handleSelectTransaction}
                  onCategoryChange={handleCategoryChange}
                  onTypeChange={handleTypeChange}
                  onRemove={handleRemoveTransaction}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Import;

