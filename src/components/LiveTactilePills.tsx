import React from 'react'
import { motion } from 'framer-motion'
import { Activity, ShieldCheck, Zap, Droplets, Flame, CheckCircle2 } from 'lucide-react'

export interface PillItem {
  id: string
  icon: React.ReactNode
  label: string
  sublabel?: string
  statusColor?: 'mint' | 'iris' | 'gold' | 'coral'
}

interface LiveTactilePillsProps {
  className?: string
}

export function LiveTactilePill({
  icon,
  label,
  sublabel,
  statusColor = 'mint',
  delay = 0,
}: {
  icon: React.ReactNode
  label: string
  sublabel?: string
  statusColor?: 'mint' | 'iris' | 'gold' | 'coral'
  delay?: number
}) {
  const colorMap = {
    mint: {
      bg: 'rgba(16, 185, 129, 0.08)',
      border: 'rgba(16, 185, 129, 0.28)',
      text: 'text-tactile-mint',
      dot: 'bg-tactile-mint',
      glow: '0 4px 20px -2px rgba(16, 185, 129, 0.25)',
    },
    iris: {
      bg: 'rgba(131, 110, 249, 0.1)',
      border: 'rgba(131, 110, 249, 0.3)',
      text: 'text-brand-violet',
      dot: 'bg-brand-violet',
      glow: '0 4px 20px -2px rgba(131, 110, 249, 0.25)',
    },
    gold: {
      bg: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.3)',
      text: 'text-accent-amber',
      dot: 'bg-accent-amber',
      glow: '0 4px 20px -2px rgba(245, 158, 11, 0.25)',
    },
    coral: {
      bg: 'rgba(255, 77, 109, 0.1)',
      border: 'rgba(255, 77, 109, 0.3)',
      text: 'text-negative',
      dot: 'bg-negative',
      glow: '0 4px 20px -2px rgba(255, 77, 109, 0.25)',
    },
  }[statusColor]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.03, y: -2 }}
      className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-semibold select-none cursor-default transition-all duration-200"
      style={{
        background: colorMap.bg,
        border: `1px solid ${colorMap.border}`,
        boxShadow: colorMap.glow,
        backdropFilter: 'blur(12px)',
      }}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="text-text-primary tracking-tight">{label}</span>
      {sublabel && (
        <span className={`text-[11px] font-bold ${colorMap.text} flex items-center gap-1`}>
          <span className={`w-1.5 h-1.5 rounded-full ${colorMap.dot} animate-pulse`} />
          {sublabel}
        </span>
      )}
    </motion.div>
  )
}

export default function LiveTactilePills({ className = '' }: LiveTactilePillsProps) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 ${className}`}>
      {/* 400ms Monad Block Finality Pill */}
      <LiveTactilePill
        icon={<Activity size={13} className="text-tactile-mint" />}
        label="Monad Parallel EVM"
        sublabel="400ms • Finality 800ms"
        statusColor="mint"
        delay={0.1}
      />

      {/* Kuru CLOB Spot Pill */}
      <LiveTactilePill
        icon={<Zap size={13} className="text-brand-violet" />}
        label="Kuru CLOB Engine"
        sublabel="0ms Pending State"
        statusColor="iris"
        delay={0.2}
      />

      {/* Perpl Margin Guard Pill (Like Maltea "Defending - no action needed") */}
      <LiveTactilePill
        icon={<ShieldCheck size={13} className="text-tactile-mint" />}
        label="Perpl Risk Guard"
        sublabel="Defending • Margin 1.9x"
        statusColor="mint"
        delay={0.3}
      />

      {/* Agora AUSD Liquidity */}
      <LiveTactilePill
        icon={<Droplets size={13} className="text-accent-sky" />}
        label="Agora AUSD"
        sublabel="$28.4M Pool Depth"
        statusColor="iris"
        delay={0.4}
      />

      {/* Streak bonus */}
      <LiveTactilePill
        icon={<Flame size={13} className="text-accent-amber" />}
        label="3-Day Win Streak"
        sublabel="+150 XP Multiplier"
        statusColor="gold"
        delay={0.5}
      />
    </div>
  )
}
