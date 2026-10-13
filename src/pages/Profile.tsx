import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Share2,
  TrendingUp,
  Shield,
  Activity,
  Award,
  Calendar,
  CheckCircle2,
  Flame,
} from 'lucide-react'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { Card, LeagueBadge, Badge, Avatar, XPBar, Tabs, Button } from '../components/ui'
import { CURRENT_PLAYER, ACHIEVEMENTS, generatePerformanceData } from '../data/mockData'
import { useAppStore } from '../store/useAppStore'
import ClashDoodleMascot from '../components/ClashDoodleMascot'
import { getLevelTier } from '../lib/levels'
import RiskAdjustedPerformance from '../components/RiskAdjustedPerformance'

function StatBar({
  label,
  value,
  max = 100,
  color,
}: {
  label: string
  value: number
  max?: number
  color: string
}) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-text-secondary">{label}</span>
        <span className="font-semibold text-text-primary font-mono">{value}</span>
      </div>
      <div className="h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

const radarData = [
  { subject: 'Consistency', A: 78 },
  { subject: 'Risk Mgmt', A: 82 },
  { subject: 'Win Rate', A: 68 },
  { subject: 'Volume', A: 55 },
  { subject: 'Streak', A: 72 },
  { subject: 'Diversity', A: 64 },
]

const seasonHistory = [
  { season: 'S1', rank: 28, league: 'Bronze', pnl: 8 },
  { season: 'S2', rank: 19, league: 'Silver', pnl: 14 },
  { season: 'S3', rank: 13, league: 'Silver', pnl: 24 },
  { season: 'S4', rank: 10, league: 'Gold', pnl: 32 },
]

export default function Profile() {
  const { xp, level, xpToNext, streak, addToast, emailUser } = useAppStore()
  const [activeTab, setActiveTab] = useState('Stats')
  const perfData = generatePerformanceData(30)
  const tier = getLevelTier(level)

  const unlockedAchs = ACHIEVEMENTS.filter((a) => a.unlocked).slice(0, 6)

  const handleShare = () => {
    addToast('Shareable Player Card link copied to clipboard!', 'success')
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-black text-text-primary font-display flex items-center gap-2">
          <User size={22} className="text-brand-violet" />
          Player Identity
        </h1>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-text-secondary hover:text-text-primary text-xs font-semibold transition-all border border-white/5 cursor-pointer"
        >
          <Share2 size={13} /> Share Profile
        </button>
      </div>

      {/* Profile Banner */}
      <div className="tactile-glass rounded-3xl p-6 border border-white/[0.08] shadow-tactile-card relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar initials={emailUser?.username ? emailUser.username.slice(0, 2).toUpperCase() : 'YO'} size="xl" />
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
                  {emailUser?.username || CURRENT_PLAYER.username}
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
                <LeagueBadge league={CURRENT_PLAYER.league} size="sm" />
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-text-secondary">
                <span>Rank #{CURRENT_PLAYER.rank} Global</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-accent-amber font-semibold">
                  <Flame size={12} /> {streak}d Active Streak
                </span>
                <span>•</span>
                <span className="text-text-muted text-[11px] font-mono">{tier.perk}</span>
              </div>
              <div className="mt-3 w-72 max-w-full">
                <XPBar xp={xp} xpToNext={xpToNext} level={level} />
              </div>
            </div>
          </div>

          <ClashDoodleMascot size="md" mood={level >= 50 ? 'cheering' : 'idle'} interactive={true} />
        </div>

        {/* Key Metrics */}
        <div className="mt-6 pt-5 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-black/20 border border-white/5">
            <span className="text-xl font-black text-tactile-mint font-display">+32.4%</span>
            <span className="text-[11px] text-text-muted block mt-0.5">Total Return</span>
          </div>
          <div className="p-3 rounded-xl bg-black/20 border border-white/5">
            <span className="text-xl font-black text-text-primary font-display">
              {CURRENT_PLAYER.winRate}%
            </span>
            <span className="text-[11px] text-text-muted block mt-0.5">Win Rate (142 Trades)</span>
          </div>
          <div className="p-3 rounded-xl bg-black/20 border border-white/5">
            <span className="text-xl font-black text-accent-amber font-display">2.14</span>
            <span className="text-[11px] text-text-muted block mt-0.5">Sharpe Ratio</span>
          </div>
          <div className="p-3 rounded-xl bg-black/20 border border-white/5">
            <span className="text-xl font-black text-brand-violet font-display font-mono">
              {xp.toLocaleString()}
            </span>
            <span className="text-[11px] text-text-muted block mt-0.5">Career XP</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3">
        {['Stats', 'Performance', 'Achievements', 'History'].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === t
                ? 'bg-brand-violet/20 text-brand-violet border border-brand-violet/30'
                : 'text-text-muted hover:text-text-primary bg-white/[0.03]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {activeTab === 'Stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <div className="tactile-glass rounded-2xl p-5 border border-white/[0.08] shadow-tactile-card">
            <h3 className="font-bold text-sm text-text-primary mb-3 font-display">
              Radar: Discipline & Execution
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <Radar
                    dataKey="A"
                    stroke="#836EF9"
                    fill="#836EF9"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Core Discipline Bars */}
          <div className="tactile-glass rounded-2xl p-5 border border-white/[0.08] shadow-tactile-card space-y-4">
            <h3 className="font-bold text-sm text-text-primary font-display">
              Consistency Assessment
            </h3>
            <StatBar label="Drawdown Control" value={88} color="#10B981" />
            <StatBar label="Streak Reliability" value={72} color="#F59E0B" />
            <StatBar label="Leverage Safety Index" value={82} color="#836EF9" />
            <StatBar label="Spot & Perp Balance" value={65} color="#38BDF8" />
          </div>
        </div>
      )}

      {activeTab === 'Performance' && (
        <div className="space-y-6">
          <div className="tactile-glass rounded-2xl p-5 border border-white/[0.08] shadow-tactile-card">
            <h3 className="font-bold text-sm text-text-primary mb-4 font-display">
              30-Day Verified Equity Curve
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={perfData}>
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#94A3B8' }} />
                  <YAxis
                    tick={{ fontSize: 9, fill: '#94A3B8' }}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <RiskAdjustedPerformance />
        </div>
      )}

      {activeTab === 'Achievements' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {unlockedAchs.map((ach) => (
            <div
              key={ach.id}
              className="tactile-glass rounded-xl p-4 border border-white/5 text-center space-y-1.5"
            >
              <div className="text-3xl">{ach.icon}</div>
              <h4 className="font-bold text-xs text-text-primary font-display">{ach.title}</h4>
              <p className="text-[10px] text-text-muted">{ach.description}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'History' && (
        <div className="tactile-glass rounded-2xl p-5 border border-white/[0.08] shadow-tactile-card">
          <h3 className="font-bold text-sm text-text-primary mb-3 font-display">
            Seasonal Placement Records
          </h3>
          <div className="divide-y divide-white/5 text-xs">
            {seasonHistory.map((s) => (
              <div key={s.season} className="flex justify-between py-2.5">
                <span className="font-bold text-text-primary">{s.season} Arena</span>
                <span className="text-text-muted">Rank #{s.rank}</span>
                <span className="text-tactile-mint font-mono font-bold">+{s.pnl}% PnL</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
