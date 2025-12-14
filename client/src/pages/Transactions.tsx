import { useState, useEffect } from 'react';
import { transactionService } from '../services/transactionService';
import { accountService } from '../services/accountService';
import { categoryService } from '../services/categoryService';
import type { Transaction, Account, Category } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Plus, Pencil, Trash2, ArrowUpCircle, ArrowDownCircle, Calendar as CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';

function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    type: 'expense' as 'income' | 'expense',
    category: '',
    account: '',
    note: '',
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeView, setActiveView] = useState('daily');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transactionsRes, accountsRes, categoriesRes] = await Promise.all([
        transactionService.getTransactions(),
        accountService.getAccounts(),
        categoryService.getCategories(),
      ]);
      setTransactions(transactionsRes.data?.data?.transactions || []);
      setAccounts(accountsRes.data?.data?.accounts || []);
      setCategories(categoriesRes.data?.data?.categories || []);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTransaction) {
        await transactionService.updateTransaction(editingTransaction._id, formData);
      } else {
        await transactionService.createTransaction(formData);
      }
      setIsDialogOpen(false);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        type: 'expense',
        category: '',
        account: '',
        note: '',
      });
      setEditingTransaction(null);
      fetchData();
    } catch (err) {
      console.error('Failed to save transaction', err);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      date: transaction.date.split('T')[0],
      amount: transaction.amount,
      type: transaction.type,
      category: typeof transaction.category === 'object' ? transaction.category._id : transaction.category,
      account: typeof transaction.account === 'object' ? transaction.account._id : transaction.account,
      note: transaction.note || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await transactionService.deleteTransaction(id);
      fetchData();
    } catch (err) {
      console.error('Failed to delete transaction', err);
    }
  };

  const groupByDate = (transactions: Transaction[]) => {
    const grouped: { [key: string]: Transaction[] } = {};
    transactions.forEach((transaction) => {
      const date = format(new Date(transaction.date), 'yyyy-MM-dd');
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(transaction);
    });
    return grouped;
  };

  const groupByMonth = (transactions: Transaction[]) => {
    const grouped: { [key: string]: Transaction[] } = {};
    transactions.forEach((transaction) => {
      const month = format(new Date(transaction.date), 'yyyy-MM');
      if (!grouped[month]) grouped[month] = [];
      grouped[month].push(transaction);
    });
    return grouped;
  };

  const getAccountName = (transaction: Transaction) => {
    // If account is populated, use it directly
    if (typeof transaction.account === 'object' && transaction.account !== null) {
      return transaction.account.name;
    }
    // Otherwise, find it in the accounts array
    return accounts.find(a => a._id === transaction.account)?.name || 'Unknown';
  };

  const getCategoryName = (transaction: Transaction) => {
    // If category is populated, use it directly
    if (typeof transaction.category === 'object' && transaction.category !== null) {
      return transaction.category.name;
    }
    // Otherwise, find it in the categories array
    return categories.find(c => c._id === transaction.category)?.name || 'Unknown';
  };

  const filteredCategories = categories.filter(c => 
    c.type === formData.type || c.type === 'both'
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const TransactionDialog = (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => {
          setEditingTransaction(null);
          setFormData({
            date: new Date().toISOString().split('T')[0],
            amount: 0,
            type: 'expense',
            category: '',
            account: '',
            note: '',
          });
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</DialogTitle>
            <DialogDescription>
              {editingTransaction ? 'Update transaction details' : 'Record a new income or expense'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value: 'income' | 'expense') => setFormData({ ...formData, type: value, category: '' })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="account">Account</Label>
              <Select value={formData.account} onValueChange={(value) => setFormData({ ...formData, account: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account._id} value={account._id}>{account.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Textarea
                id="note"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="Add a note..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{editingTransaction ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

  const TransactionCard = ({ transaction }: { transaction: Transaction }) => (
    <Card className="border-subtle hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
              {transaction.type === 'income' ? (
                <ArrowUpCircle className="h-4 w-4 text-green-600" />
              ) : (
                <ArrowDownCircle className="h-4 w-4 text-red-600" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{getCategoryName(transaction)}</span>
                <Badge variant="outline" className="text-xs">{getAccountName(transaction)}</Badge>
              </div>
              {transaction.note && (
                <p className="text-sm text-muted-foreground mt-1">{transaction.note}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(transaction.date), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
            </span>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => handleEdit(transaction)}>
                <Pencil className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(transaction._id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const DailyView = () => {
    const grouped = groupByDate(transactions);
    const dates = Object.keys(grouped).sort().reverse();

    return (
      <div className="space-y-6">
        {dates.length === 0 ? (
          <Card className="border-subtle">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">No transactions found</CardTitle>
              <CardDescription>Start by adding your first transaction</CardDescription>
            </CardContent>
          </Card>
        ) : (
          dates.map((date) => {
            const dayTransactions = grouped[date];
            const dayIncome = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const dayExpense = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

            return (
              <div key={date} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{format(new Date(date), 'EEEE, MMMM dd, yyyy')}</h3>
                  <div className="flex gap-4 text-sm">
                    <span className="text-green-600">+₹{dayIncome.toFixed(2)}</span>
                    <span className="text-red-600">-₹{dayExpense.toFixed(2)}</span>
                    <span className="font-semibold">Net: ₹{(dayIncome - dayExpense).toFixed(2)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {dayTransactions.map((transaction) => (
                    <TransactionCard key={transaction._id} transaction={transaction} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  const MonthlyView = () => {
    const grouped = groupByMonth(transactions);
    const months = Object.keys(grouped).sort().reverse();

    return (
      <div className="space-y-6">
        {months.map((month) => {
          const monthTransactions = grouped[month];
          const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
          const monthExpense = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

          return (
            <div key={month} className="space-y-3">
              <Card className="border-subtle">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{format(new Date(month + '-01'), 'MMMM yyyy')}</CardTitle>
                    <div className="flex gap-4 text-sm">
                      <span className="text-green-600">Income: ₹{monthIncome.toFixed(2)}</span>
                      <span className="text-red-600">Expense: ₹{monthExpense.toFixed(2)}</span>
                      <span className="font-semibold">Net: ₹{(monthIncome - monthExpense).toFixed(2)}</span>
                    </div>
                  </div>
                  <CardDescription>{monthTransactions.length} transaction{monthTransactions.length !== 1 ? 's' : ''}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {monthTransactions.map((transaction) => (
                    <TransactionCard key={transaction._id} transaction={transaction} />
                  ))}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    );
  };

  const CalendarView = () => {
    const transactionsOnDate = selectedDate
      ? transactions.filter(t => format(new Date(t.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'))
      : [];

    return (
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-subtle">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card className="border-subtle">
            <CardHeader>
              <CardTitle>
                {selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : 'Select a date'}
              </CardTitle>
              <CardDescription>
                {transactionsOnDate.length} transaction{transactionsOnDate.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {transactionsOnDate.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No transactions on this date</p>
              ) : (
                transactionsOnDate.map((transaction) => (
                  <TransactionCard key={transaction._id} transaction={transaction} />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
          <p className="text-xs text-muted-foreground">Track your income and expenses</p>
        </div>
        {TransactionDialog}
      </div>

      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className="mt-6">
          <DailyView />
        </TabsContent>
        <TabsContent value="calendar" className="mt-6">
          <CalendarView />
        </TabsContent>
        <TabsContent value="monthly" className="mt-6">
          <MonthlyView />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Transactions;

