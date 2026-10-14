import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
const buttonVariants = cva('inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50 active:scale-[.98]', {
  variants: { variant: {
    default: 'bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-glow',
    secondary: 'bg-indigo-50 text-primary hover:bg-indigo-100 dark:bg-indigo-500/15 dark:text-indigo-300',
    outline: 'border border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100',
    ghost: 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
    destructive: 'bg-red-500 text-white hover:bg-red-600'
  }, size: { default: 'h-11 px-5', sm: 'h-9 px-3 text-xs', lg: 'h-12 px-6', icon: 'h-10 w-10 p-0' } }, defaultVariants: { variant: 'default', size: 'default' }
});
type Props = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;
export const Button = forwardRef<HTMLButtonElement, Props>(({ className, size, variant, ...props }, ref) => <button ref={ref} className={cn(buttonVariants({ size, variant }), className)} {...props} />);
Button.displayName = 'Button';
