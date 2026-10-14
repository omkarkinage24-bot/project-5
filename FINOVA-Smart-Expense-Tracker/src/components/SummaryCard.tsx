import { ArrowDownLeft, ArrowUpRight, Landmark, Wallet } from 'lucide-react';
import { motion } from 'motion/react';
import { inr } from '../lib/finance';
import { cn } from '../lib/utils';
export function SummaryCard({ title, value, kind, subtitle, index }: { title: string; value: number; kind: 'balance' | 'income' | 'expense' | 'savings'; subtitle: string; index: number }) {
  const Icon = kind === 'balance' ? Wallet : kind === 'income' ? ArrowDownLeft : kind === 'expense' ? ArrowUpRight : Landmark;
  const special = kind === 'balance';
  return <motion.div initial={{ opacity: 0, y: 13 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35, delay: index * .07 }} className={cn('group relative flex min-h-[155px] flex-col justify-between overflow-hidden rounded-[22px] border px-5 py-5 shadow-panel transition-all hover:-translate-y-1 sm:px-6', special ? 'border-transparent bg-gradient-to-br from-[#7768F9] via-[#6459E8] to-[#4B46BF] text-white shadow-glow' : 'border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900')}>
    {special && <><div className="pointer-events-none absolute -right-12 -top-20 h-[200px] w-[200px] rounded-full border-[35px] border-white/[.07]"/><div className="pointer-events-none absolute -right-6 bottom-[-95px] h-[200px] w-[200px] rounded-full bg-white/[.045]"/></>}
    <div className="relative flex items-start justify-between gap-3"><p className={cn('text-[12px] font-bold', special ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400')}>{title}</p><div className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-[13px]', special ? 'bg-white/20 text-white' : kind === 'income' ? 'bg-emerald-50 text-mint dark:bg-emerald-500/10' : kind === 'expense' ? 'bg-red-50 text-coral dark:bg-red-500/10' : 'bg-indigo-50 text-primary dark:bg-indigo-500/10')}><Icon size={20} strokeWidth={2}/></div></div>
    <div className="relative mt-4"><p className={cn('break-all text-[24px] font-extrabold tracking-[-.06em] sm:text-[28px] xl:text-[25px] 2xl:text-[29px]', !special && 'text-ink dark:text-white')}>{inr(value)}</p><p className={cn('mt-2 text-[10px] font-semibold', special ? 'text-indigo-100/90' : 'text-slate-400')}>{subtitle}</p></div>
  </motion.div>;
}
