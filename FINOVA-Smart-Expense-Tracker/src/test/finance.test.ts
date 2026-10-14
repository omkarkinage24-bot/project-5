import { describe, expect, it } from 'vitest';
import { budgetStatus, byMonth, categoryBreakdown, exportCSV, filteredTransactions, formSchema, inr, parsePaise, totals, type Transaction } from '../lib/finance';
const list: Transaction[] = [
  { id: '1', title: 'Salary', amountPaise: 4000050, type: 'income', category: 'Salary', date: '2026-10-02' },
  { id: '2', title: 'Lunch', amountPaise: 12575, type: 'expense', category: 'Food & Dining', date: '2026-10-05' },
  { id: '3', title: 'Books', amountPaise: 20000, type: 'expense', category: 'Education', date: '2026-09-05' },
  { id: '4', title: 'Dinner', amountPaise: 9975, type: 'expense', category: 'Food & Dining', date: '2026-10-06' },
];
describe('money safety', () => {
  it('parses decimal rupees to integer paise without float drift', () => { expect(parsePaise('125.75')).toBe(12575); expect(parsePaise('0.01')).toBe(1); expect(parsePaise('2.1')).toBe(210); });
  it('rejects malformed or zero input', () => { expect(formSchema.safeParse({ title: '', amount: '0', type: 'expense', category: 'Salary', date: '2026-10-01' }).success).toBe(false); expect(formSchema.safeParse({ title: 'X', amount: '-40', type: 'expense', category: 'Food & Dining', date: '2026-10-01' }).success).toBe(false); expect(formSchema.safeParse({ title: 'X', amount: '2.999', type: 'expense', category: 'Food & Dining', date: '2026-10-01' }).success).toBe(false); });
  it('formats Indian currency', () => expect(inr(12345678)).toContain('1,23,456.78'));
});
describe('transactions and filters', () => {
  it('computes integer totals accurately', () => expect(totals(byMonth(list, '2026-10'))).toMatchObject({ income: 4000050, expenses: 22550, balance: 3977500 }));
  it('filters category, month, type, search then sorts by amount', () => {
    const result = filteredTransactions(list, { search: 'n', category: 'Food & Dining', type: 'expense', month: '2026-10', sort: 'amount-high' });
    expect(result.map(t => t.id)).toEqual(['2', '4']);
  });
  it('groups spending by category', () => expect(categoryBreakdown(byMonth(list, '2026-10'))[0]).toMatchObject({ name: 'Food & Dining', value: 22550 }));
  it('escapes CSV quotes and formula injection', () => {
    const csv = exportCSV([{ ...list[0], title: '=SUM(A1)' }]);
    expect(csv).toContain("'=SUM(A1)"); expect(csv).toContain('Amount (INR)');
  });
});
describe('budget thresholds', () => {
  it('provides warnings at exact thresholds', () => {
    expect(budgetStatus(0, 0)).toBe('unset'); expect(budgetStatus(699, 1000)).toBe('safe');
    expect(budgetStatus(700, 1000)).toBe('warning'); expect(budgetStatus(899, 1000)).toBe('warning');
    expect(budgetStatus(900, 1000)).toBe('danger'); expect(budgetStatus(1200, 1000)).toBe('danger');
  });
});
