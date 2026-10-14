import * as Primitive from '@radix-ui/react-progress';
import { cn } from '../../lib/utils';
export function Progress({ value, color = 'bg-primary', className }: { value: number; color?: string; className?: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  return <Primitive.Root value={clamped} className={cn('relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700', className)}><Primitive.Indicator style={{ transform: `translateX(-${100 - clamped}%)` }} className={cn('h-full w-full rounded-full transition-transform duration-700 ease-out', color)} /></Primitive.Root>;
}
