import { useState, useEffect } from 'react';
import { statsService } from '../services/statsService';
import { transactionService } from '../services/transactionService';
import type { StatsData, Transaction } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  format,
  subDays,
  addMonths,
  addWeeks,
  addYears,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear
} from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D'];

function Stats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('expense');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryTransactions, setCategoryTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchStats();
    setSelectedCategory(null);
  }, [period, currentDate]);

  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryTransactions();
    }
  }, [selectedCategory, currentDate, period]);

  const getDateRange = () => {
    let startDate: Date;
    let endDate: Date;

    switch (period) {
      case 'weekly':
        startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
        endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
        break;
      case 'monthly':
        startDate = startOfMonth(currentDate);
        endDate = endOfMonth(currentDate);
        break;
      case 'yearly':
        startDate = startOfYear(currentDate);
        endDate = endOfYear(currentDate);
        break;
    }

    return { startDate, endDate };
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { startDate, endDate } = getDateRange();

      const response = await statsService.getStats({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        period,
      });

      setStats(response.data?.data || null);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch statistics';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryTransactions = async () => {
    if (!selectedCategory) return;

    try {
      const { startDate, endDate } = getDateRange();
      const response = await transactionService.getTransactions({
        category: selectedCategory,
        type: activeTab,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      setCategoryTransactions(response.data?.data?.transactions || []);
    } catch (err) {
      console.error('Failed to fetch category transactions:', err);
    }
  };

  const handlePreviousPeriod = () => {
    switch (period) {
      case 'weekly':
        setCurrentDate(prev => subDays(prev, 7));
        break;
      case 'monthly':
        setCurrentDate(prev => addMonths(prev, -1));
        break;
      case 'yearly':
        setCurrentDate(prev => addYears(prev, -1));
        break;
    }
  };

  const handleNextPeriod = () => {
    switch (period) {
      case 'weekly':
        setCurrentDate(prev => addWeeks(prev, 1));
        break;
      case 'monthly':
        setCurrentDate(prev => addMonths(prev, 1));
        break;
      case 'yearly':
        setCurrentDate(prev => addYears(prev, 1));
        break;
    }
  };

  const getPeriodLabel = () => {
    switch (period) {
      case 'weekly':
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
        return `${format(weekStart, 'MMM dd')} - ${format(weekEnd, 'MMM dd, yyyy')}`;
      case 'monthly':
        return format(currentDate, 'MMMM yyyy').toUpperCase();
      case 'yearly':
        return format(currentDate, 'yyyy');
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
      <Card className="border-subtle border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive text-sm">Error</CardTitle>
          <CardDescription className="text-xs">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="border-subtle">
        <CardHeader>
          <CardTitle className="text-sm">No Data Available</CardTitle>
          <CardDescription className="text-xs">Start adding transactions to see statistics</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const categoryData = stats.categoryBreakdown?.filter((item: any) =>
    activeTab === 'income'
      ? item.type === 'income'
      : item.type === 'expense'
  ) || [];

  const categoryChartData = categoryData.map((item: any) => ({
    name: item.category,
    value: item.amount,
    count: item.count,
    percentage: item.percentage,
  }));

  const totalAmount = activeTab === 'income' ? stats.totalIncome : stats.totalExpense;

  return (
    <div className="space-y-4">
      {/* Header with Period Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Statistics</h1>
          <p className="text-xs text-muted-foreground">Insights into your spending patterns</p>
        </div>
        <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly" className="text-xs">Weekly</SelectItem>
            <SelectItem value="monthly" className="text-xs">Monthly</SelectItem>
            <SelectItem value="yearly" className="text-xs">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Period Navigation */}
      <Card className="border-subtle">
        <CardContent className="p-3">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreviousPeriod}
              className="h-7 w-7 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-semibold min-w-[200px] text-center">
              {getPeriodLabel()}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextPeriod}
              className="h-7 w-7 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Income/Expense Tabs */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger value="income" className="text-xs flex flex-col items-center gap-0.5 py-2">
            <span>Income</span>
            <span className="font-semibold text-green-600">₹{stats.totalIncome?.toFixed(2) || '0.00'}</span>
          </TabsTrigger>
          <TabsTrigger value="expense" className="text-xs flex flex-col items-center gap-0.5 py-2">
            <span>Expense</span>
            <span className="font-semibold text-red-600">₹{stats.totalExpense?.toFixed(2) || '0.00'}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="income" className="space-y-4 mt-4">
          {renderCategoryContent()}
        </TabsContent>

        <TabsContent value="expense" className="space-y-4 mt-4">
          {renderCategoryContent()}
        </TabsContent>
      </Tabs>
    </div>
  );

  function renderCategoryContent() {
    if (selectedCategory) {
      return renderCategoryTransactions();
    }

    return (
      <>
        {/* Category Pie Chart */}
        <Card className="border-subtle">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              {activeTab === 'income' ? 'Income' : 'Expense'} by Category
            </CardTitle>
            <CardDescription className="text-xs">
              Total: ₹{totalAmount?.toFixed(2) || '0.00'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categoryChartData.length === 0 ? (
              <div className="flex items-center justify-center h-[280px] text-xs text-muted-foreground">
                No {activeTab} data available for this period
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={100}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {categoryChartData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '0.5px solid hsl(var(--border))',
                      borderRadius: '6px',
                      fontSize: '11px',
                      padding: '6px 8px'
                    }}
                    formatter={(value: any) => `₹${value.toFixed(2)}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Category List with Amounts */}
        <Card className="border-subtle">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Categories</CardTitle>
            <CardDescription className="text-xs">
              Click on a category to view transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categoryChartData.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground">
                No categories found
              </div>
            ) : (
              <div className="space-y-2">
                {categoryChartData.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(item.name)}
                    className="w-full flex items-center justify-between p-3 border-subtle border rounded-md hover:bg-accent transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-medium text-xs">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {item.count} transaction{item.count !== 1 ? 's' : ''}
                      </span>
                      <span className="font-semibold text-xs min-w-[80px] text-right">
                        ₹{item.value.toFixed(2)}
                      </span>
                      <span className="text-xs text-muted-foreground w-12 text-right">
                        {item.percentage?.toFixed(1)}%
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </>
    );
  }

  function renderCategoryTransactions() {
    const groupedByDate: { [key: string]: Transaction[] } = {};

    categoryTransactions.forEach(transaction => {
      const dateKey = format(new Date(transaction.date), 'yyyy-MM-dd');
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = [];
      }
      groupedByDate[dateKey].push(transaction);
    });

    const dates = Object.keys(groupedByDate).sort().reverse();

    return (
      <>
        {/* Back Button and Category Header */}
        <Card className="border-subtle">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="h-7 text-xs"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                Back to Categories
              </Button>
              <div className="text-sm font-semibold">{selectedCategory}</div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions by Date */}
        <Card className="border-subtle">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Transactions</CardTitle>
            <CardDescription className="text-xs">
              {categoryTransactions.length} transaction{categoryTransactions.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categoryTransactions.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground">
                No transactions found for this category
              </div>
            ) : (
              <div className="space-y-4">
                {dates.map(date => {
                  const dayTransactions = groupedByDate[date];
                  const dayTotal = dayTransactions.reduce((sum, t) => sum + t.amount, 0);

                  return (
                    <div key={date} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold">
                          {format(new Date(date), 'EEEE, MMMM dd, yyyy')}
                        </h4>
                        <span className={`text-xs font-semibold ${activeTab === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          ₹{dayTotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {dayTransactions.map(transaction => (
                          <div
                            key={transaction._id}
                            className="flex items-center justify-between p-2 border-subtle border rounded-md text-xs"
                          >
                            <div className="flex-1">
                              <div className="font-medium">{transaction.note || 'No description'}</div>
                              <div className="text-muted-foreground text-[10px]">
                                {typeof transaction.account === 'object' && transaction.account !== null
                                  ? transaction.account.name
                                  : transaction.accountDetails?.name || 'Unknown Account'}
                              </div>
                            </div>
                            <div className={`font-semibold ${activeTab === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                              ₹{transaction.amount.toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </>
    );
  }
}

export default Stats;

