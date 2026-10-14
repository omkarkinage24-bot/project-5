import { ArrowDownRight, ArrowUpRight, Lightbulb, Sparkles, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { byMonth, categoryBreakdown, changeMonth, inr, percent, totals, type Transaction } from '../lib/finance';
export function Insights({ data, month, budget }: { data: Transaction[]; month: string; budget: number }) {
  const current = totals(byMonth(data, month));
  const prior = totals(byMonth(data, changeMonth(month, -1)));
  const top = categoryBreakdown(byMonth(data, month))[0];
  const insights: { title: string; detail: string; color: string; icon: typeof Lightbulb }[] = [];
  if (top) insights.push({ title: 'Top spending category', detail: `${top.name} leads with ${inr(top.value)} this month.`, color: 'bg-violet-50 text-primary dark:bg-violet-500/15', icon: Sparkles });
  if (budget > 0) insights.push({ title: 'Budget utilization', detail: `${Math.round(percent(current.expenses, budget))}% of your ${inr(budget)} monthly limit used.`, color: 'bg-orange-50 text-orange-500 dark:bg-orange-500/10', icon: Lightbulb });
  if (prior.expenses > 0) {
    const delta = Math.round((current.expenses - prior.expenses) / prior.expenses * 100);
    insights.push({ title: 'Vs previous month', detail: `Expenses ${delta < 0 ? 'decreased' : delta > 0 ? 'increased' : 'stayed the same'}${delta === 0 ? '' : ` by ${Math.abs(delta)}%`} compared with last month.`, color: delta <= 0 ? 'bg-emerald-50 text-mint dark:bg-emerald-500/10' : 'bg-red-50 text-coral dark:bg-red-500/10', icon: delta <= 0 ? ArrowDownRight : ArrowUpRight });
  }
  if (current.income > 0) insights.push({ title: 'Monthly savings rate', detail: `You kept ${Math.round((current.balance / current.income) * 100)}% of your income this month.`, color: 'bg-blue-50 text-blue-500 dark:bg-blue-500/10', icon: TrendingUp });
  return <Card className="min-w-0 p-5 sm:p-6"><div className="mb-5 flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-primary dark:bg-indigo-500/10"><Sparkles size={18}/></span><div><h3 className="text-[15px] font-extrabold text-ink dark:text-white">Smart insights</h3><p className="text-[10px] text-slate-400">Powered by your transactions, not guesses</p></div></div>{insights.length ? <div className="space-y-4">{insights.slice(0, 3).map(({ title, detail, color, icon: Icon }) => <div key={title} className="flex gap-3"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${color}`}><Icon size={17}/></span><div><p className="text-[11px] font-extrabold text-ink dark:text-white">{title}</p><p className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">{detail}</p></div></div>)}</div> : <div className="flex min-h-[145px] flex-col items-center justify-center gap-3 text-center"><Lightbulb size={28} className="text-indigo-300"/><p className="max-w-[240px] text-xs leading-5 text-slate-400">Add some income or expenses to discover personalized insights.</p></div>}</Card>;
}
