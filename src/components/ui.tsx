import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, Star } from 'lucide-react'
import { LEAGUE_CONFIG } from '../data/mockData'
import { useAppStore } from '../store/useAppStore'

// ─── Button ──────────────────────────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({ variant = 'primary', size = 'md', children, className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none'
  const sizes = { sm: 'px-3.5 py-1.5 text-xs', md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3 text-base' }
  const variants = {
    primary: 'bg-gradient-to-r from-brand-violet to-brand-purple hover:from-[#917DFF] hover:to-[#7961ED] text-white shadow-pill-active border border-white/15',
    secondary: 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-text-primary shadow-sm hover:border-brand-violet/40',
    ghost: 'bg-transparent hover:bg-white/[0.06] text-text-secondary hover:text-text-primary',
    danger: 'bg-negative/10 hover:bg-negative/20 text-negative border border-negative/30 shadow-sm',
    success: 'bg-tactile-mint/10 hover:bg-tactile-mint/20 text-tactile-mint border border-tactile-mint/30 shadow-pill-mint',
  }
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  onClick?: () => void
}

export function Card({ children, className = '', hover = false, glow = false, onClick }: CardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -2, borderColor: 'rgba(131,110,249,0.3)' } : {}}
      className={`bg-bg-card rounded-2xl border border-white/[0.08] shadow-tactile-card backdrop-blur-md ${glow ? 'shadow-tactile-card-hover border-brand-violet/30' : ''} ${hover ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  )
}

// ─── XP Bar ───────────────────────────────────────────────────────────────────

interface XPBarProps {
  xp: number
  xpToNext: number
  level: number
  showLabel?: boolean
  compact?: boolean
}

export function XPBar({ xp, xpToNext, level, showLabel = true, compact = false }: XPBarProps) {
  const pct = Math.min((xp / xpToNext) * 100, 100)
  return (
    <div className={compact ? 'space-y-1' : 'space-y-2'}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">Level {level}</span>
          <span className="text-brand-violet font-semibold">{xp.toLocaleString()} / {xpToNext.toLocaleString()} XP</span>
        </div>
      )}
      <div className={`relative overflow-hidden rounded-full bg-white/5 ${compact ? 'h-1.5' : 'h-2'}`}>
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-violet to-brand-purple"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)', animation: 'shine 2.5s ease-in-out infinite' }}
        />
      </div>
    </div>
  )
}

// ─── League Badge ─────────────────────────────────────────────────────────────

interface LeagueBadgeProps {
  league: keyof typeof LEAGUE_CONFIG
  size?: 'sm' | 'md' | 'lg'
}

export function LeagueBadge({ league, size = 'md' }: LeagueBadgeProps) {
  const cfg = LEAGUE_CONFIG[league]
  const sizes = { sm: 'px-2 py-0.5 text-xs', md: 'px-2.5 py-1 text-xs', lg: 'px-3 py-1.5 text-sm' }
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-bold uppercase tracking-wider ${sizes[size]}`}
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
    >
      {cfg.icon} {league}
    </span>
  )
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

interface AvatarProps {
  initials: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  level?: number
  className?: string
}

export function Avatar({ initials, size = 'md', level, className = '' }: AvatarProps) {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-20 h-20 text-2xl' }
  return (
    <div className={`relative inline-flex ${className}`}>
      <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-brand-violet to-brand-purple flex items-center justify-center font-bold text-white flex-shrink-0`}>
        {initials}
      </div>
      {level !== undefined && (
        <span className="absolute -bottom-1 -right-1 text-xs bg-bg-card border border-white/10 rounded-full px-1 py-0.5 font-bold text-brand-violet leading-none">
          {level}
        </span>
      )}
    </div>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────

interface BadgeProps {
  children: React.ReactNode
  color?: 'violet' | 'green' | 'red' | 'amber' | 'blue' | 'gray'
  className?: string
}

export function Badge({ children, color = 'violet', className = '' }: BadgeProps) {
  const colors = {
    violet: 'bg-brand-violet/10 text-brand-violet border-brand-violet/20',
    green: 'bg-positive/10 text-positive border-positive/20',
    red: 'bg-negative/10 text-negative border-negative/20',
    amber: 'bg-warning/10 text-warning border-warning/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    gray: 'bg-white/5 text-text-secondary border-white/10',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colors[color]} ${className}`}>
      {children}
    </span>
  )
}

// ─── Demo Badge ───────────────────────────────────────────────────────────────

export function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-warning/10 text-warning border border-warning/30 uppercase tracking-wider">
      <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
      Demo Mode
    </span>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: string
  subValue?: string
  positive?: boolean
  negative?: boolean
  icon?: React.ReactNode
}

export function StatCard({ label, value, subValue, positive, negative, icon }: StatCardProps) {
  const valueColor = positive ? 'text-positive' : negative ? 'text-negative' : 'text-text-primary'
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-secondary text-xs mb-1">{label}</p>
          <p className={`text-xl font-bold ${valueColor}`}>{value}</p>
          {subValue && <p className={`text-xs mt-0.5 ${positive ? 'text-positive' : negative ? 'text-negative' : 'text-text-secondary'}`}>{subValue}</p>}
        </div>
        {icon && <div className="text-brand-violet/60">{icon}</div>}
      </div>
    </Card>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`relative w-full ${sizes[size]} bg-bg-card border border-white/10 rounded-2xl shadow-2xl`}
            onClick={e => e.stopPropagation()}
          >
            {title && (
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h3 className="text-lg font-bold text-text-primary">{title}</h3>
                <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-white/5">
                  <X size={18} />
                </button>
              </div>
            )}
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

interface TabsProps {
  tabs: string[]
  active: string
  onChange: (tab: string) => void
  className?: string
}

export function Tabs({ tabs, active, onChange, className = '' }: TabsProps) {
  return (
    <div className={`flex gap-1 bg-bg-secondary rounded-lg p-1 ${className}`}>
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            active === tab ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          {active === tab && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute inset-0 bg-brand-violet/20 border border-brand-violet/30 rounded-md"
            />
          )}
          <span className="relative z-10">{tab}</span>
        </button>
      ))}
    </div>
  )
}

// ─── Toast Container ──────────────────────────────────────────────────────────

export function ToastContainer() {
  const { toasts, removeToast } = useAppStore()
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl min-w-[280px] max-w-sm"
            style={{
              background: toast.type === 'xp' ? 'rgba(155,123,255,0.15)' :
                          toast.type === 'success' ? 'rgba(53,212,154,0.15)' :
                          toast.type === 'error' ? 'rgba(255,100,124,0.15)' : 'rgba(21,23,36,0.95)',
              borderColor: toast.type === 'xp' ? 'rgba(155,123,255,0.3)' :
                           toast.type === 'success' ? 'rgba(53,212,154,0.3)' :
                           toast.type === 'error' ? 'rgba(255,100,124,0.3)' : 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {toast.type === 'xp' && <Star size={16} className="text-brand-violet flex-shrink-0" />}
            {toast.type === 'success' && <CheckCircle size={16} className="text-positive flex-shrink-0" />}
            {toast.type === 'error' && <AlertCircle size={16} className="text-negative flex-shrink-0" />}
            {toast.type === 'info' && <Info size={16} className="text-blue-400 flex-shrink-0" />}
            <span className="text-sm text-text-primary flex-1">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="text-text-secondary hover:text-text-primary">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-white/5 rounded-lg ${className}`} />
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

interface ProgressBarProps {
  value: number
  max: number
  color?: string
  height?: string
  className?: string
  showLabel?: boolean
}

export function ProgressBar({ value, max, color = '#9B7BFF', height = 'h-1.5', className = '', showLabel = false }: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-xs text-text-secondary mb-1">
          <span>{value} / {max}</span>
          <span>{Math.round(pct)}%</span>
        </div>
      )}
      <div className={`relative overflow-hidden rounded-full bg-white/5 ${height}`}>
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

// ─── Animated Counter ─────────────────────────────────────────────────────────

interface CounterProps {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
}

export function AnimatedCounter({ value, prefix = '', suffix = '', decimals = 0, className = '' }: CounterProps) {
  const [displayed, setDisplayed] = React.useState(0)

  React.useEffect(() => {
    let start = 0
    const duration = 1200
    const startTime = performance.now()
    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(start + (value - start) * eased)
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [value])

  return (
    <span className={className}>
      {prefix}{displayed.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{suffix}
    </span>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
}

export function SectionHeader({ title, subtitle, action, className = '' }: SectionHeaderProps) {
  return (
    <div className={`flex items-start justify-between ${className}`}>
      <div>
        <h2 className="text-lg font-bold text-text-primary">{title}</h2>
        {subtitle && <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
