import { BarChart3, ChevronLeft, ChevronRight, LayoutDashboard, MoonStar, PiggyBank, ReceiptText, Settings2, Sun, Wallet2, X, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Page } from '../lib/finance';
import type { ReactNode } from 'react';
const links = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Transactions', icon: ReceiptText },
  { name: 'Analytics', icon: BarChart3 },
  { name: 'Budgets', icon: PiggyBank },
  { name: 'Settings', icon: Settings2 }
] as const;
type Props = { page: Page; navigate: (value: Page) => void; theme: 'light' | 'dark'; toggleTheme: () => void; mobile: boolean; closeMobile: () => void; collapsed: boolean; setCollapsed: (v: boolean) => void };
function NavContent({ page, navigate, theme, toggleTheme, mobile, closeMobile, collapsed, setCollapsed }: Props) {
  const narrow = collapsed && !mobile;
  return <div className="flex h-full flex-col">
    <div className={cn('flex items-center justify-between px-6 pt-8 pb-11', narrow && 'px-4 justify-center')}>
      <button className="flex items-center gap-3" onClick={() => navigate('Dashboard')} aria-label="Go to FINOVA dashboard">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-gradient-to-br from-[#817aff] to-[#5146d8] shadow-lg shadow-indigo-900/30"><Wallet2 className="h-6 w-6 text-white" strokeWidth={2.5} /></div>
        {!narrow && <div className="text-left"><span className="block text-[23px] font-extrabold tracking-[-.07em] text-white">finova<span className="text-[#9d93ff]">.</span></span><span className="block text-[9px] font-bold uppercase tracking-[.23em] text-slate-400">finance made simple</span></div>}
      </button>
      {mobile && <button aria-label="Close navigation" onClick={closeMobile} className="rounded-lg p-2 text-slate-400 hover:text-white"><X size={21} /></button>}
    </div>
    <div className={cn('px-5 pb-3 text-[10px] font-bold uppercase tracking-[.22em] text-slate-500', narrow && 'text-center px-1')}>{narrow ? '•' : 'Workspace'}</div>
    <nav className="space-y-1.5 px-3" aria-label="Main navigation">
      {links.map(({ name, icon: Icon }) => <button key={name} title={narrow ? name : undefined} aria-current={page === name ? 'page' : undefined} onClick={() => { navigate(name); closeMobile(); }} className={cn('group flex h-12 w-full items-center gap-3.5 rounded-xl px-4 text-[13px] font-bold transition-all duration-200', narrow && 'justify-center px-0', page === name ? 'bg-[#625be8] text-white shadow-md shadow-indigo-950/20' : 'text-slate-400 hover:bg-white/10 hover:text-white')}><Icon className="h-[19px] w-[19px] shrink-0" strokeWidth={2} />{!narrow && <span>{name}</span>}{page === name && !narrow && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />}</button>)}
    </nav>
    <div className="mt-auto px-4 pb-6">
      {!narrow && <div className="relative mb-6 overflow-hidden rounded-[18px] bg-gradient-to-br from-[#3D3A85] to-[#292A60] px-5 py-5"><div className="pointer-events-none absolute -right-9 -top-6 h-32 w-32 rounded-full border-[17px] border-white/5" /><Sparkles size={22} className="mb-3 text-[#C4C0FF]"/><p className="relative text-[13px] font-extrabold leading-5 text-white">Make every rupee count.</p><p className="relative mt-1 text-[11px] leading-[1.65] text-indigo-200">Small steps today. Big wins tomorrow.</p></div>}
      <button onClick={toggleTheme} title={narrow ? 'Toggle theme' : undefined} className={cn('flex h-11 w-full items-center gap-3 rounded-xl px-3 text-[12px] font-bold text-slate-300 transition hover:bg-white/10', narrow && 'justify-center px-0')}>{theme === 'dark' ? <Sun size={19}/> : <MoonStar size={19}/>} {!narrow && <span>{theme === 'dark' ? 'Light appearance' : 'Dark appearance'}</span>}</button>
      {!mobile && <button onClick={() => setCollapsed(!collapsed)} className={cn('mt-2 flex h-9 w-full items-center gap-3 rounded-xl px-3 text-[11px] font-bold text-slate-500 hover:bg-white/10 hover:text-white', narrow && 'justify-center px-0')}>{collapsed ? <ChevronRight size={17}/> : <ChevronLeft size={17}/>} {!narrow && <span>Collapse sidebar</span>}</button>}
      {!narrow && <div className="mt-5 border-t border-slate-700/60 pt-5 text-center text-[10px] font-medium text-slate-500">FINOVA © 2026 · Made with care</div>}
    </div>
  </div>;
}
export function Sidebar(props: Props) {
  const content = (mobile: boolean): ReactNode => <NavContent {...props} mobile={mobile} />;
  return <>
    <aside className={cn('sticky top-0 hidden h-screen shrink-0 overflow-y-auto bg-[#151B33] transition-[width] duration-300 lg:block', props.collapsed ? 'w-[92px]' : 'w-[248px]')}>{content(false)}</aside>
    {props.mobile && <div className="fixed inset-0 z-40 lg:hidden"><button className="absolute inset-0 h-full w-full bg-slate-950/60" onClick={props.closeMobile} aria-label="Close navigation overlay"/><aside className="absolute inset-y-0 left-0 w-[280px] max-w-[90vw] overflow-y-auto bg-[#151B33] shadow-2xl">{content(true)}</aside></div>}
  </>;
}
