import { addMonths, format, isValid, parseISO, startOfMonth, subMonths } from 'date-fns';
import { z } from 'zod';

export const expenseCategories = ['Food & Dining', 'Shopping', 'Transportation', 'Education', 'Entertainment', 'Bills & Utilities', 'Health', 'Travel', 'Other'] as const;
export const incomeCategories = ['Salary', 'Freelance', 'Allowance', 'Gifts', 'Investments', 'Other'] as const;
export type TransactionType = 'income' | 'expense';
export type Page = 'Dashboard' | 'Transactions' | 'Analytics' | 'Budgets' | 'Settings';
export type Transaction = { id: string; title: string; amountPaise: number; type: TransactionType; category: string; date: string; demo?: boolean };
export type Filters = { search: string; category: string; type: string; month: string; sort: 'newest' | 'oldest' | 'amount-high' | 'amount-low' };
export type Goal = { name: string; targetPaise: number; savedPaise: number };

export const transactionSchema = z.object({
  id: z.string().min(1), title: z.string().trim().min(1),
  amountPaise: z.number().int().positive().safe(), type: z.enum(['income', 'expense']),
  category: z.string().min(1), date: z.string().refine(d => isValid(parseISO(d)), 'Invalid date'), demo: z.boolean().optional()
});
export const moneyInputSchema = z.string().trim().regex(/^\d{1,9}(?:\.\d{1,2})?$/, 'Enter a valid amount (up to 2 decimals)').refine(v => parsePaise(v) > 0, 'Amount must be greater than zero');
export const formSchema = z.object({
  title: z.string().trim().min(1, 'Please enter a title').max(75, 'Maximum 75 characters'),
  amount: moneyInputSchema,
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Please choose a category'),
  date: z.string().min(1, 'Choose a date').refine(v => isValid(parseISO(v)), 'Enter a valid date')
}).superRefine((data, ctx) => {
  const allowed: readonly string[] = data.type === 'income' ? incomeCategories : expenseCategories;
  if (!allowed.includes(data.category)) ctx.addIssue({ code: 'custom', path: ['category'], message: 'Choose a category for this transaction type' });
});
export type TransactionFormValues = z.infer<typeof formSchema>;

/** Convert decimal INR string to integer paise without floating-point rounding. */
export function parsePaise(value: string): number {
  const match = /^(\d{1,9})(?:\.(\d{1,2}))?$/.exec(value.trim());
  if (!match) return 0;
  return Number(match[1]) * 100 + Number((match[2] || '').padEnd(2, '0'));
}
export function inr(paise: number, compact = false): string {
  if (compact && Math.abs(paise) >= 10000000) return `₹${(paise / 10000000).toFixed(2)}L`;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(paise / 100);
}
export function formatMonth(month: string) { return format(parseISO(`${month}-01`), 'MMMM yyyy'); }
export function monthOf(date: string) { return date.slice(0, 7); }
export function monthOptions(currentMonth: string, count = 18) {
  const start = parseISO(`${currentMonth}-01`);
  return Array.from({ length: count }, (_, i) => format(subMonths(start, i), 'yyyy-MM'));
}
export function changeMonth(month: string, delta: number) { return format(addMonths(parseISO(`${month}-01`), delta), 'yyyy-MM'); }
export function totals(transactions: Transaction[]) {
  const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amountPaise, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amountPaise, 0);
  return { income, expenses, balance: income - expenses, savingsRate: income > 0 ? ((income - expenses) / income) * 100 : null };
}
export function byMonth(transactions: Transaction[], month: string) { return transactions.filter(t => monthOf(t.date) === month); }
export function filteredTransactions(data: Transaction[], filters: Filters) {
  const q = filters.search.trim().toLocaleLowerCase();
  return data.filter(t =>
    (!filters.month || monthOf(t.date) === filters.month) &&
    (!q || t.title.toLocaleLowerCase().includes(q) || t.category.toLocaleLowerCase().includes(q)) &&
    (!filters.type || t.type === filters.type) &&
    (!filters.category || t.category === filters.category)
  ).sort((a, b) => {
    if (filters.sort === 'amount-high') return b.amountPaise - a.amountPaise || b.date.localeCompare(a.date);
    if (filters.sort === 'amount-low') return a.amountPaise - b.amountPaise || b.date.localeCompare(a.date);
    return filters.sort === 'oldest' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
  });
}
export function categoryBreakdown(transactions: Transaction[]) {
  const map = new Map<string, number>();
  transactions.filter(t => t.type === 'expense').forEach(t => map.set(t.category, (map.get(t.category) || 0) + t.amountPaise));
  return [...map.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}
export function sixMonthSeries(data: Transaction[], selectedMonth: string) {
  const current = startOfMonth(parseISO(`${selectedMonth}-01`));
  return Array.from({ length: 6 }, (_, index) => {
    const date = subMonths(current, 5 - index);
    const values = totals(byMonth(data, format(date, 'yyyy-MM')));
    return { name: format(date, 'MMM'), income: values.income / 100, expenses: values.expenses / 100 };
  });
}
export function daySeries(data: Transaction[], selectedMonth: string) {
  const count = new Date(Number(selectedMonth.slice(0, 4)), Number(selectedMonth.slice(5, 7)), 0).getDate();
  const monthData = byMonth(data, selectedMonth);
  return Array.from({ length: count }, (_, index) => {
    const day = index + 1;
    const list = monthData.filter(t => Number(t.date.slice(8, 10)) === day);
    const t = totals(list);
    return { day: String(day), income: t.income / 100, expenses: t.expenses / 100, balance: t.balance / 100 };
  });
}
export function budgetStatus(spent: number, limit: number): 'safe' | 'warning' | 'danger' | 'unset' {
  if (limit <= 0) return 'unset';
  const used = spent / limit;
  return used >= .9 ? 'danger' : used >= .7 ? 'warning' : 'safe';
}
export function percent(part: number, whole: number) { return whole > 0 ? (part / whole) * 100 : 0; }

/** Use tabular CSV escaping and guard against spreadsheet formula injection. */
export function exportCSV(list: Transaction[]) {
  const esc = (value: string | number) => {
    let s = String(value);
    if (/^[\s]*[=+@\-]/.test(s)) s = `'${s}`;
    return `"${s.replaceAll('"', '""')}"`;
  };
  const rows = [['Title', 'Amount (INR)', 'Type', 'Category', 'Date'], ...list.map(t => [t.title, (t.amountPaise / 100).toFixed(2), t.type, t.category, t.date])];
  return '\uFEFF' + rows.map(row => row.map(esc).join(',')).join('\r\n');
}
export function makeDemoData(month: string): Transaction[] {
  const seed = [
    ['Monthly salary', 65000, 'income', 'Salary', 2], ['Freelance design', 12500, 'income', 'Freelance', 11],
    ['Groceries & essentials', 3600, 'expense', 'Food & Dining', 3], ['Coffee & breakfast', 420, 'expense', 'Food & Dining', 5],
    ['Metro pass', 1400, 'expense', 'Transportation', 6], ['Design course', 2499, 'expense', 'Education', 7],
    ['Weekend dinner', 1850, 'expense', 'Food & Dining', 9], ['Internet & utilities', 2890, 'expense', 'Bills & Utilities', 10],
    ['New headphones', 3999, 'expense', 'Shopping', 12], ['Movie night', 640, 'expense', 'Entertainment', 13],
    ['Bookstore', 880, 'expense', 'Education', 14], ['Cab ride', 560, 'expense', 'Transportation', 15],
    ['Health checkup', 1100, 'expense', 'Health', 18], ['Day trip', 2400, 'expense', 'Travel', 20],
  ] as const;
  const prev = changeMonth(month, -1), prev2 = changeMonth(month, -2);
  const make = (m: string, suffix: string, scale = 1) => seed.map(([title, amount, type, category, day], i) => ({
    id: `demo-${suffix}-${i}`, title, amountPaise: Math.round(amount * scale * 100), type,
    category, date: `${m}-${String(Math.min(day, new Date(Number(m.slice(0, 4)), Number(m.slice(5, 7)), 0).getDate())).padStart(2, '0')}`, demo: true
  }));
  // Anchor to the selected period so demo mode is useful even for an older month.
  return [...make(month, 'current'), ...make(prev, 'previous', 1.13), ...make(prev2, 'older', .86)];
}
