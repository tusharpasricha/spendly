import { useState, useEffect } from 'react';
import { accountService } from '../services/accountService';
import type { Account } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Pencil, Trash2, Wallet, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [formData, setFormData] = useState({ name: '', balance: 0, description: '' });
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    fetchAccounts();
    fetchTotalBalance();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await accountService.getAccounts();
      setAccounts(response.data?.data?.accounts || []);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch accounts';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalBalance = async () => {
    try {
      const response = await accountService.getTotalBalance();
      setTotalBalance(response.data?.data?.totalBalance || 0);
    } catch (err) {
      console.error('Failed to fetch total balance', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAccount) {
        await accountService.updateAccount(editingAccount._id, formData);
      } else {
        await accountService.createAccount(formData);
      }
      setIsDialogOpen(false);
      setFormData({ name: '', balance: 0, description: '' });
      setEditingAccount(null);
      fetchAccounts();
      fetchTotalBalance();
    } catch (err) {
      console.error('Failed to save account', err);
    }
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setFormData({
      name: account.name,
      balance: account.balance,
      description: account.description || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this account?')) return;
    try {
      await accountService.deleteAccount(id);
      fetchAccounts();
      fetchTotalBalance();
    } catch (err) {
      console.error('Failed to delete account', err);
      alert('Cannot delete account with existing transactions');
    }
  };

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Accounts</h1>
          <p className="text-xs text-muted-foreground">Manage your accounts and balances</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 text-xs" onClick={() => { setEditingAccount(null); setFormData({ name: '', balance: 0, description: '' }); }}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingAccount ? 'Edit Account' : 'Add New Account'}</DialogTitle>
                <DialogDescription>
                  {editingAccount ? 'Update account details' : 'Create a new account to track your money'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Account Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Bank Account, Cash, Wallet"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="balance">Initial Balance</Label>
                  <Input
                    id="balance"
                    type="number"
                    step="0.01"
                    value={formData.balance}
                    onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Add a description..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingAccount ? 'Update' : 'Create'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-subtle">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-1.5 text-sm">
            <TrendingUp className="h-3.5 w-3.5" />
            Total Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">₹{totalBalance.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-0.5">Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}</p>
        </CardContent>
      </Card>

      {accounts.length === 0 ? (
        <Card className="border-subtle">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wallet className="h-8 w-8 text-muted-foreground mb-3" />
            <CardTitle className="mb-1.5 text-sm">No accounts found</CardTitle>
            <CardDescription className="mb-3 text-xs">
              Get started by creating your first account
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <Card key={account._id} className="border-subtle transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-1.5">
                    <Wallet className="h-3.5 w-3.5 text-primary" />
                    <CardTitle className="text-sm">{account.name}</CardTitle>
                  </div>
                  <Badge variant={account.balance >= 0 ? 'default' : 'destructive'} className="text-[10px] h-5 px-1.5">
                    ₹{account.balance.toFixed(2)}
                  </Badge>
                </div>
                {account.description && (
                  <CardDescription className="text-xs">{account.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex gap-1.5">
                  <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => handleEdit(account)}>
                    <Pencil className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => handleDelete(account._id)}>
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Accounts;

