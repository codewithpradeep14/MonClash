import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  Trophy,
  Award,
  ArrowRight,
  Clock,
  ChevronRight,
  Activity,
  BarChart2,
  Flame,
  Wallet,
  ShieldCheck,
  Droplets,
  Sparkles,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  Card,
  XPBar,
  LeagueBadge,
  Avatar,
  DemoBadge,
  Badge,
  AnimatedCounter,
  ProgressBar,
  Button,
} from '../components/ui'
import { useAppStore } from '../store/useAppStore'
import {
  MARKETS,
  RECENT_TRADES,
  MISSIONS,
  CURRENT_PLAYER,
  generatePerformanceData,
} from '../data/mockData'
import ClashDoodleMascot from '../components/ClashDoodleMascot'
import LiveTactilePills from '../components/LiveTactilePills'
import { getLevelTier, getLevelTitle } from '../lib/levels'
import RiskAdjustedPerformance from '../components/RiskAdjustedPerformance'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

function PlayerHero() {
  const {
    xp,
    level,
    xpToNext,
    streak,
    hasClaimedDailyStreak,
    claimDailyStreak,
    tradingMode,
    emailUser,
  } = useAppStore()
  const { league, rank, winRate } = CURRENT_PLAYER
  const tier = getLevelTier(level)

  return (
    <motion.div variants={fadeUp}>
      <div className="tactile-glass rounded-3xl p-6 border border-white/[0.08] shadow-tactile-card relative overflow-hidden">
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Player Info & Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar initials={emailUser?.username ? emailUser.username.slice(0, 2).toUpperCase() : 'MC'} size="xl" />
              <div
                className="absolute -bottom-1 -right-1 text-white border-2 border-bg-card rounded-full px-2 py-0.5 text-xs font-black shadow-sm"
                style={{ backgroundColor: tier.color }}
              >
                {tier.badge} Lv.{level}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-2xl font-black text-text-primary font-display">
                  {emailUser?.username || 'Arena Champion'}
                </h2>
                <span
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: `${tier.color}20`,
                    color: tier.color,
                    borderColor: `${tier.color}40`,
                  }}
                >
                  {tier.title}
                </span>
                <LeagueBadge league={league} size="sm" />
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-text-secondary">
                <span>Rank #{rank} Global</span>
                <span>•</span>
                <span className="text-tactile-mint font-semibold">{winRate}% Win Rate</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-accent-amber font-semibold">
                  <Flame size={13} /> {streak}d Streak
                </span>
                <span>•</span>
                <span className="text-text-muted text-[11px] font-mono">{tier.perk}</span>
              </div>

              <div className="mt-3 w-72 max-w-full">
                <XPBar xp={xp} xpToNext={xpToNext} level={level} />
              </div>
            </div>
          </div>

          {/* Interactive Mascot Companion & Daily Streak Box */}
          <div className="flex items-center gap-4 bg-bg-secondary/70 p-3.5 rounded-2xl border border-white/5">
            <ClashDoodleMascot
              size="md"
              mood={hasClaimedDailyStreak ? 'cheering' : 'idle'}
              showSpeech={false}
              interactive={true}
            />
            <div className="text-right">
              <span className="text-[11px] font-bold text-accent-amber uppercase tracking-wider block">
                Daily Discipline Bonus
              </span>
              <p className="text-xs text-text-muted mt-0.5">
                {hasClaimedDailyStreak ? 'Bonus claimed today!' : 'Keep your 3-day streak alive!'}
              </p>
              <button
                onClick={claimDailyStreak}
                disabled={hasClaimedDailyStreak}
                className={`mt-2 text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  hasClaimedDailyStreak
                    ? 'bg-white/5 text-text-muted cursor-not-allowed'
                    : 'bg-accent-amber/20 hover:bg-accent-amber/30 text-accent-amber border border-accent-amber/30 shadow-sm active:scale-95'
                }`}
              >
                {hasClaimedDailyStreak ? 'Claimed ✓' : 'Claim +150 XP 🔥'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function PortfolioStats() {
  const { balance, pnl, walletBalances, tradingMode } = useAppStore()

  const stats = [
    {
      label: 'Portfolio Balance',
      value: balance,
      prefix: '$',
      color: 'text-text-primary',
      sub: tradingMode === 'demo' ? 'Simulated Capital' : 'Monad Live Wallet',
      decimals: 2,
    },
    {
      label: 'Total PnL',
      value: pnl,
      prefix: '+$',
      color: 'text-tactile-mint',
      sub: '+28.4% Return',
      decimals: 2,
    },
    {
      label: 'Agora AUSD Reserves',
      value: walletBalances.ausd,
      prefix: '$',
      color: 'text-brand-violet',
      sub: 'Monad Native Stablecoin',
      decimals: 2,
    },
    {
      label: 'Available MON Fuel',
      value: walletBalances.mon,
      prefix: '',
      color: 'text-text-primary',
      sub: 'Gas & Collateral',
      decimals: 2,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {stats.map((s) => (
        <motion.div variants={fadeUp} key={s.label}>
          <div className="tactile-glass rounded-2xl p-4.5 border border-white/[0.08] shadow-tactile-card">
            <div className="text-xs text-text-secondary mb-1 font-medium">{s.label}</div>
            <div className={`text-xl sm:text-2xl font-black font-display ${s.color}`}>
              {s.prefix}
              <AnimatedCounter value={s.value} decimals={s.decimals} />
            </div>
            <div className="text-[11px] text-text-muted mt-1 font-mono">{s.sub}</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function PerformanceChart() {
  const [period, setPeriod] = useState('30D')
  const periods = ['7D', '30D', '90D']
  const data = useMemo(
    () => generatePerformanceData(period === '7D' ? 7 : period === '30D' ? 30 : 90),
    [period]
  )

  return (
    <motion.div variants={fadeUp}>
      <div className="tactile-glass rounded-2xl p-5 border border-white/[0.08] shadow-tactile-card">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-base text-text-primary font-display">
              Risk-Adjusted Performance
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Consistency Curve • Sharpe Ratio: 2.14 • Max Drawdown: 4.2%
            </p>
          </div>
          <div className="flex gap-1 bg-black/30 rounded-xl p-1 border border-white/5">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
                  period === p
                    ? 'bg-brand-violet/20 text-brand-violet border border-brand-violet/30'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#836EF9" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#836EF9" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#94A3B8' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#94A3B8' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                width={45}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null
                  return (
                    <div className="tactile-glass rounded-xl p-2.5 border border-brand-violet/30 text-xs shadow-xl">
                      <div className="text-text-muted mb-1">{label}</div>
                      <div className="text-text-primary font-bold">
                        Equity: ${payload[0].value?.toLocaleString()}
                      </div>
                    </div>
                  )
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#836EF9"
                strokeWidth={2}
                fill="url(#perfGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}

function MarketWatchlist() {
  const { setCurrentPage, setSelectedMarket } = useAppStore()

  const handleSelectMarket = (symbol: string) => {
    setSelectedMarket(symbol)
    setCurrentPage('spot')
  }

  return (
    <motion.div variants={fadeUp}>
      <div className="tactile-glass rounded-2xl p-5 border border-white/[0.08] shadow-tactile-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-text-primary font-display">
              Supported Monad Markets
            </h3>
            <p className="text-[11px] text-text-muted">Kuru CLOB & Perpl Feeds</p>
          </div>
          <button
            onClick={() => setCurrentPage('spot')}
            className="text-xs text-brand-violet hover:text-brand-purple flex items-center gap-1 font-semibold cursor-pointer"
          >
            All Markets <ChevronRight size={12} />
          </button>
        </div>

        <div className="space-y-2">
          {MARKETS.slice(0, 4).map((m) => (
            <div
              key={m.symbol}
              onClick={() => handleSelectMarket(m.symbol)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-bg-secondary/60 hover:bg-bg-secondary border border-white/5 hover:border-brand-violet/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
                  style={{ background: `${m.logoColor}20`, color: m.logoColor }}
                >
                  {m.symbol.slice(0, 3)}
                </div>
                <div>
                  <span className="text-xs font-bold text-text-primary group-hover:text-brand-violet transition-colors">
                    {m.symbol}
                  </span>
                  <span className="text-[10px] text-text-muted block">{m.name}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-text-primary block">
                  ${m.price < 1 ? m.price.toFixed(4) : m.price.toLocaleString()}
                </span>
                <span
                  className={`text-[10px] font-bold ${
                    m.change24h >= 0 ? 'text-tactile-mint' : 'text-negative'
                  }`}
                >
                  {m.change24h >= 0 ? '+' : ''}
                  {m.change24h.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function DailyMissionsWidget() {
  const { missions, completeMission, setCurrentPage } = useAppStore()
  const daily = missions.filter((m) => m.type === 'daily').slice(0, 3)

  return (
    <motion.div variants={fadeUp}>
      <div className="tactile-glass rounded-2xl p-5 border border-white/[0.08] shadow-tactile-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-text-primary font-display">Daily Quests</h3>
            <p className="text-[11px] text-text-muted">Resets in 4h 22m</p>
          </div>
          <button
            onClick={() => setCurrentPage('missions')}
            className="text-xs text-brand-violet hover:text-brand-purple flex items-center gap-1 font-semibold cursor-pointer"
          >
            View All <ChevronRight size={12} />
          </button>
        </div>

        <div className="space-y-2.5">
          {daily.map((m) => (
            <div
              key={m.id}
              className={`p-3 rounded-xl border transition-all ${
                m.completed
                  ? 'bg-tactile-mint/5 border-tactile-mint/20'
                  : 'bg-bg-secondary/60 border-white/5'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">{m.icon}</span>
                  <span className="text-xs font-bold text-text-primary">{m.title}</span>
                </div>
                <span className="text-[11px] font-bold text-brand-violet">+{m.xpReward} XP</span>
              </div>

              <ProgressBar value={m.progress} max={m.target} height="h-1" />

              <div className="flex items-center justify-between mt-2 text-[10px]">
                <span className="text-text-muted">
                  {m.progress} / {m.target} completed
                </span>
                {m.completed ? (
                  <span className="text-tactile-mint font-bold">✓ Claimed</span>
                ) : m.progress >= m.target ? (
                  <button
                    onClick={() => completeMission(m.id)}
                    className="px-2.5 py-0.5 rounded-full bg-brand-violet text-white font-bold text-[10px] shadow-sm hover:scale-105 transition-transform cursor-pointer"
                  >
                    Claim Reward
                  </button>
                ) : (
                  <span className="text-text-muted">In Progress</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function ArenaShortcuts() {
  const { setCurrentPage } = useAppStore()

  return (
    <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3.5">
      <div
        onClick={() => setCurrentPage('spot')}
        className="tactile-glass rounded-2xl p-4.5 border border-white/[0.08] hover:border-tactile-mint/40 shadow-tactile-card transition-all cursor-pointer group"
      >
        <div className="w-9 h-9 rounded-xl bg-tactile-mint/15 text-tactile-mint flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
          <TrendingUp size={18} />
        </div>
        <h4 className="font-bold text-sm text-text-primary font-display">Spot Arena</h4>
        <p className="text-[11px] text-text-muted mt-0.5">Kuru onchain order book</p>
        <div className="flex items-center gap-1 mt-3 text-xs font-bold text-tactile-mint">
          <span>Enter</span> <ArrowRight size={12} />
        </div>
      </div>

      <div
        onClick={() => setCurrentPage('perps')}
        className="tactile-glass rounded-2xl p-4.5 border border-white/[0.08] hover:border-brand-violet/40 shadow-tactile-card transition-all cursor-pointer group"
      >
        <div className="w-9 h-9 rounded-xl bg-brand-violet/15 text-brand-violet flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
          <Zap size={18} />
        </div>
        <h4 className="font-bold text-sm text-text-primary font-display">Perps Arena</h4>
        <p className="text-[11px] text-text-muted mt-0.5">Perpl high-frequency engine</p>
        <div className="flex items-center gap-1 mt-3 text-xs font-bold text-brand-violet">
          <span>Enter</span> <ArrowRight size={12} />
        </div>
      </div>
    </motion.div>
  )
}

export default function Dashboard() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto"
    >
      {/* Header with Title and Maltea-Style Live Status Pills */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight font-display">
            Arena Terminal
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Season 4 • One Arena. Two Trading Styles. One Player Identity.
          </p>
        </div>
        <DemoBadge />
      </div>

      {/* Floating Tactical Live Pills */}
      <LiveTactilePills />

      {/* Player Hero Card */}
      <PlayerHero />

      {/* Stats Overview */}
      <PortfolioStats />

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <PerformanceChart />
          <RiskAdjustedPerformance />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ArenaShortcuts />
            <MarketWatchlist />
          </div>
        </div>

        <div className="space-y-6">
          <DailyMissionsWidget />
        </div>
      </div>
    </motion.div>
  )
}
