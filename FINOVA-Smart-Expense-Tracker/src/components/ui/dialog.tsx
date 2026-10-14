import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { PropsWithChildren } from 'react';
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export function DialogContent({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#0f1631]/60 backdrop-blur-[3px] data-[state=open]:animate-fade-up" />
    <DialogPrimitive.Content className={cn('fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg max-h-[92dvh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[24px] border border-slate-100 bg-white p-6 shadow-2xl outline-none dark:border-slate-700 dark:bg-slate-900 sm:p-8', className)}>
      {children}<DialogPrimitive.Close aria-label="Close dialog" className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"><X className="h-5 w-5" /></DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>;
}
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
