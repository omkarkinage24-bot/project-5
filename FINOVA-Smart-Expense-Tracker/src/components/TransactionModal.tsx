import { useEffect } from 'react';
import { format } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ArrowDownLeft, ArrowUpRight, Check, IndianRupee } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input, Select } from './ui/input';
import { cn } from '../lib/utils';
import { expenseCategories, formSchema, incomeCategories, inr, type Transaction, type TransactionFormValues } from '../lib/finance';
type Props = { open: boolean; onOpenChange: (v: boolean) => void; existing: Transaction | null; onSave: (form: TransactionFormValues) => void };
const labelClass = 'mb-2 block text-[12px] font-bold text-slate-600 dark:text-slate-300';
export function TransactionModal({ open, onOpenChange, existing, onSave }: Props) {
  const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm<TransactionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '', amount: '', type: 'expense', category: 'Food & Dining', date: format(new Date(), 'yyyy-MM-dd') }
  });
  useEffect(() => {
    if (open) reset(existing ? { title: existing.title, amount: (existing.amountPaise / 100).toFixed(2), type: existing.type, category: existing.category, date: existing.date } : { title: '', amount: '', type: 'expense', category: 'Food & Dining', date: format(new Date(), 'yyyy-MM-dd') });
  }, [existing, open, reset]);
  const type = watch('type');
  const categories = type === 'income' ? incomeCategories : expenseCategories;
  const amount = watch('amount');
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent>
    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-primary dark:bg-indigo-500/15"><IndianRupee size={23} /></div>
    <DialogTitle className="text-[24px] font-extrabold tracking-tight text-ink dark:text-white">{existing ? 'Edit transaction' : 'Add a transaction'}</DialogTitle>
    <DialogDescription className="mt-2 text-[13px] leading-6 text-slate-500 dark:text-slate-400">{existing ? 'Update the details to keep your finances accurate.' : 'Every little expense matters. Let’s keep track.'}</DialogDescription>
    <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSave)} noValidate>
      <div><label className={labelClass} htmlFor="transaction-type">Transaction type</label><div id="transaction-type" className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800" role="group" aria-label="Transaction type">{(['expense', 'income'] as const).map(value => <button type="button" key={value} onClick={() => { setValue('type', value, { shouldValidate: true }); setValue('category', value === 'income' ? 'Salary' : 'Food & Dining', { shouldValidate: true }); }} className={cn('flex h-10 items-center justify-center gap-2 rounded-[10px] text-[12px] font-bold capitalize transition', type === value ? 'bg-white text-ink shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-400 hover:text-slate-600')}>{value === 'income' ? <ArrowDownLeft size={16} className="text-mint"/> : <ArrowUpRight size={16} className="text-coral"/>}{value}{type === value && <Check size={13} className="text-primary"/>}</button>)}</div></div>
      <div><label className={labelClass} htmlFor="tx-title">Transaction title</label><Input id="tx-title" autoFocus placeholder="e.g. Weekly groceries" aria-invalid={Boolean(errors.title)} {...register('title')} />{errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}</div>
      <div className="grid grid-cols-2 gap-3"><div><label className={labelClass} htmlFor="tx-amount">Amount (₹)</label><Input id="tx-amount" type="text" inputMode="decimal" placeholder="0.00" aria-invalid={Boolean(errors.amount)} {...register('amount')} />{errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount.message}</p>}</div><div><label className={labelClass} htmlFor="tx-date">Date</label><Input id="tx-date" type="date" aria-invalid={Boolean(errors.date)} {...register('date')}/>{errors.date && <p className="mt-1 text-xs text-red-500">{errors.date.message}</p>}</div></div>
      <div><label className={labelClass} htmlFor="tx-category">Category</label><Select id="tx-category" aria-invalid={Boolean(errors.category)} {...register('category')}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</Select>{errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}</div>
      <div className="flex items-center justify-between rounded-xl bg-[#F6F6FF] px-4 py-3 text-xs text-slate-500 dark:bg-indigo-500/10">Transaction preview <span className={cn('font-extrabold', type === 'income' ? 'text-mint' : 'text-coral')}>{type === 'income' ? '+' : '−'}{inr(Number.isFinite(Number(amount)) && Number(amount) >= 0 ? Math.round(Number(amount) * 100) : 0)}</span></div>
      <div className="flex gap-3 pt-2"><Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">Cancel</Button><Button type="submit" className="flex-1"><Check size={17}/>{existing ? 'Save changes' : 'Add transaction'}</Button></div>
    </form>
  </DialogContent></Dialog>;
}
