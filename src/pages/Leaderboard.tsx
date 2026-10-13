import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Search, TrendingUp, Shield, Activity, Flame, Star } from 'lucide-react'
import { Card, LeagueBadge, Badge, Tabs, Avatar } from '../components/ui'
import { PLAYERS } from '../data/mockData'
import ClashDoodleMascot from '../components/ClashDoodleMascot'

function Podium() {
  const top3 = PLAYERS.slice(0, 3)
  const order = [1, 0, 2] // 2nd, 1st, 3rd

  const heights = [90, 120, 70]
  const medals = ['🥈', '🥇', '🥉']
  const colors = ['#C0C0C0', '#FBBF24', '#CD7F32']

  return (
    <div className="tactile-glass rounded-2xl p-6 border border-white/[0.08] shadow-tactile-card relative overflow-hidden">
      <div className="relative">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold bg-accent-amber/15 text-accent-amber border border-accent-amber/30">
            <Trophy size={13} /> Season 4 Champions Podium
          </span>
        </div>

        <div className="flex items-end justify-center gap-4 sm:gap-8 h-56">
          {order.map((playerIdx, podiumPos) => {
            const player = top3[playerIdx]
            const height = heights[podiumPos]
            const medal = medals[podiumPos]
            const color = colors[podiumPos]
            const rank = playerIdx + 1

            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: podiumPos * 0.15,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex flex-col items-center"
              >
                {/* Player info */}
                <div className="mb-3 text-center">
                  <div className="text-3xl mb-1">{medal}</div>
                  <Avatar initials={player.avatar} size="lg" />
                  <div className="text-xs sm:text-sm font-bold text-text-primary mt-1.5 font-display truncate max-w-[100px]">
                    {player.username}
                  </div>
                  <div className="text-[11px] text-tactile-mint font-bold font-mono mt-0.5">
                    +{player.pnlPct}%
                  </div>
                </div>

                {/* Podium block */}
                <motion.div
                  className="w-20 sm:w-28 rounded-t-2xl flex items-center justify-center text-2xl font-black font-display shadow-lg"
                  style={{
                    height: `${height}px`,
                    background: `${color}18`,
                    border: `2px solid ${color}40`,
                    color,
                    transformOrigin: 'bottom',
                  }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{
                    delay: 0.3 + podiumPos * 0.1,
                    duration: 0.5,
                    ease: 'easeOut',
                  }}
                >
                  {rank}
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function PlayerRow({
  player,
  index,
}: {
  player: typeof PLAYERS[0]
  index: number
}) {
  const isMe = player.isCurrentUser

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
        isMe
          ? 'bg-brand-violet/10 border-brand-violet/30 shadow-sm'
          : 'border-white/5 hover:bg-white/[0.03]'
      }`}
    >
      {/* Rank */}
      <div
        className={`w-8 text-center font-black text-sm flex-shrink-0 ${
          player.rank === 1
            ? 'text-accent-amber'
            : player.rank === 2
            ? 'text-text-secondary'
            : player.rank === 3
            ? 'text-orange-500'
            : 'text-text-muted'
        }`}
      >
        {player.rank <= 3 ? ['🥇', '🥈', '🥉'][player.rank - 1] : `#${player.rank}`}
      </div>

      {/* Avatar + name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar initials={player.avatar} size="sm" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs sm:text-sm font-bold truncate font-display ${
                isMe ? 'text-brand-violet' : 'text-text-primary'
              }`}
            >
              {player.username}
            </span>
            {isMe && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-brand-violet text-white">
                You
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-text-muted mt-0.5">
            <LeagueBadge league={player.league} size="sm" />
            <span>Lv.{player.level}</span>
          </div>
        </div>
      </div>

      {/* PnL */}
      <div className="text-right hidden sm:block w-24">
        <div className="text-xs sm:text-sm font-bold text-tactile-mint font-mono">
          +{player.pnlPct}%
        </div>
        <div className="text-[10px] text-text-muted">${(player.pnl / 1000).toFixed(1)}k</div>
      </div>

      {/* Win Rate */}
      <div className="text-right hidden md:block w-20">
        <div className="text-xs font-semibold text-text-primary">{player.winRate}%</div>
        <div className="text-[10px] text-text-muted">Win Rate</div>
      </div>

      {/* Consistency Score */}
      <div className="text-right hidden lg:block w-24">
        <div className="text-xs font-bold text-accent-amber font-mono">
          {player.consistency}/100
        </div>
        <div className="text-[10px] text-text-muted">Discipline</div>
      </div>
    </motion.div>
  )
}

export default function Leaderboard() {
  const [activeLeague, setActiveLeague] = useState('All')
  const [search, setSearch] = useState('')

  const leagues = ['All', 'Champion', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze']

  const filtered = PLAYERS.filter((p) => {
    const matchLeague = activeLeague === 'All' || p.league === activeLeague
    const matchSearch = p.username.toLowerCase().includes(search.toLowerCase())
    return matchLeague && matchSearch
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-text-primary font-display">
          Global Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
          Season 4 rankings rewarded by consistency, win rate, and risk discipline.
        </p>
      </div>

      <Podium />

      {/* Search & League Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {leagues.map((lg) => (
            <button
              key={lg}
              onClick={() => setActiveLeague(lg)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeLeague === lg
                  ? 'bg-brand-violet/20 text-brand-violet border border-brand-violet/30 shadow-sm'
                  : 'bg-white/5 text-text-muted hover:text-text-secondary'
              }`}
            >
              {lg}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-56">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search trader..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-brand-violet/50"
          />
        </div>
      </div>

      {/* Roster Table */}
      <div className="tactile-glass rounded-2xl p-4 border border-white/[0.08] shadow-tactile-card space-y-1.5">
        <div className="flex items-center gap-3 px-4 py-2 text-[11px] font-bold text-text-muted uppercase tracking-wider border-b border-white/5">
          <span className="w-8 text-center">Rank</span>
          <span className="flex-1">Trader Identity</span>
          <span className="w-24 text-right hidden sm:block">Return</span>
          <span className="w-20 text-right hidden md:block">Win Rate</span>
          <span className="w-24 text-right hidden lg:block">Discipline</span>
        </div>

        {filtered.map((player, idx) => (
          <PlayerRow key={player.id} player={player} index={idx} />
        ))}
      </div>
    </div>
  )
}
