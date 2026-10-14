import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn('rounded-[22px] border border-slate-100 bg-white shadow-panel dark:border-slate-800 dark:bg-slate-900', className)} {...props} />; }
