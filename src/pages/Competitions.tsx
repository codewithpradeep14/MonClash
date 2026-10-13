import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Swords,
  Clock,
  Users,
  Trophy,
  ChevronRight,
  Zap,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { Card, Badge, Modal, Button } from '../components/ui'
import { COMPETITIONS } from '../data/mockData'
import { useAppStore } from '../store/useAppStore'
import ClashDoodleMascot from '../components/ClashDoodleMascot'

function CountdownBadge({ endTime }: { endTime: string }) {
  const end = new Date(endTime)
  const now = new Date()
  const diff = end.getTime() - now.getTime()
  if (diff <= 0) return <span className="text-xs text-text-muted">Concluded</span>
  const days = Math.floor(diff / 86400000)
  const hrs = Math.floor((diff % 86400000) / 3600000)

  return (
    <span className="flex items-center gap-1 text-[11px] text-accent-amber font-semibold font-mono">
      <Clock size={11} />
      {days > 0 ? `${days}d ${hrs}h` : `${hrs}h`} left
    </span>
  )
}

function CompetitionCard({
  comp,
  onSelect,
}: {
  comp: (typeof COMPETITIONS)[0]
  onSelect: (c: (typeof COMPETITIONS)[0]) => void
}) {
  const { joinedCompetitions } = useAppStore()
  const joined = joinedCompetitions.includes(comp.id)

  const isLive = comp.status === 'active'
  const isPerps = comp.type === 'perps'

  return (
    <motion.div
      whileHover={{ y: -3 }}
      onClick={() => onSelect(comp)}
      className="tactile-glass rounded-2xl p-5 border border-white/[0.08] shadow-tactile-card hover:border-brand-violet/30 transition-all cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                isLive
                  ? 'bg-tactile-mint/15 text-tactile-mint border-tactile-mint/30'
                  : 'bg-accent-amber/15 text-accent-amber border-accent-amber/30'
              }`}
            >
              {isLive ? '● Live Clash' : 'Upcoming'}
            </span>
            <span className="text-[11px] text-text-muted flex items-center gap-1">
              {isPerps ? (
                <Zap size={11} className="text-brand-violet" />
              ) : (
                <TrendingUp size={11} className="text-tactile-mint" />
              )}
              <span className="capitalize">{comp.type}</span>
            </span>
          </div>

          {joined && (
            <span className="flex items-center gap-1 text-[11px] text-tactile-mint font-bold">
              <CheckCircle2 size={12} /> Registered
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-text-primary mb-1 font-display">
          {comp.title}
        </h3>
        <p className="text-xs text-text-secondary leading-relaxed mb-4 line-clamp-2">
          {comp.description}
        </p>

        <div className="grid grid-cols-2 gap-2.5 mb-4 p-2.5 rounded-xl bg-black/25 text-xs">
          <div>
            <span className="text-[10px] text-text-muted">Arena Prize</span>
            <p className="font-bold text-brand-violet font-mono mt-0.5">{comp.prizePool}</p>
          </div>
          <div>
            <span className="text-[10px] text-text-muted">Entry Criteria</span>
            <p className="font-bold text-text-primary font-mono mt-0.5">
              {comp.entryRequirement}
            </p>
          </div>
        </div>

        {/* Participants progress */}
        <div className="mb-4">
          <div className="flex justify-between text-[11px] text-text-muted mb-1 font-mono">
            <span className="flex items-center gap-1">
              <Users size={11} /> {comp.participants} joined
            </span>
            <span>{comp.maxParticipants} max capacity</span>
          </div>
          <div className="h-1 bg-black/40 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-brand-violet rounded-full"
              style={{
                width: `${Math.min((comp.participants / comp.maxParticipants) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <CountdownBadge endTime={comp.endTime} />
        <span className="text-xs font-semibold text-brand-violet flex items-center gap-0.5">
          View Tournament <ChevronRight size={13} />
        </span>
      </div>
    </motion.div>
  )
}

export default function Competitions() {
  const { joinedCompetitions, joinCompetition, leaveCompetition } = useAppStore()
  const [selectedComp, setSelectedComp] = useState<(typeof COMPETITIONS)[0] | null>(null)

  const isJoined = selectedComp ? joinedCompetitions.includes(selectedComp.id) : false

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-text-primary font-display">
          Trading Tournaments
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
          Join scheduled competitive sprints. Consistent Sharpe ratios climb tournament leaderboards.
        </p>
      </div>

      {/* Competitions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {COMPETITIONS.map((c) => (
          <CompetitionCard key={c.id} comp={c} onSelect={setSelectedComp} />
        ))}
      </div>

      {/* Tournament Details Modal */}
      {selectedComp && (
        <Modal
          open={!!selectedComp}
          onClose={() => setSelectedComp(null)}
          title={selectedComp.title}
        >
          <div className="space-y-4">
            <p className="text-xs text-text-secondary leading-relaxed">
              {selectedComp.description}
            </p>

            <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-black/30 text-xs">
              <div>
                <span className="text-text-muted text-[10px]">Prize Rewards</span>
                <p className="font-bold text-brand-violet font-mono mt-0.5">
                  {selectedComp.prizePool}
                </p>
              </div>
              <div>
                <span className="text-text-muted text-[10px]">Roster Status</span>
                <p className="font-bold text-text-primary font-mono mt-0.5">
                  {selectedComp.participants} / {selectedComp.maxParticipants} Players
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-text-primary mb-2">Tournament Rules:</h4>
              <ul className="space-y-1 text-xs text-text-secondary">
                {selectedComp.rules.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-brand-violet">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              {isJoined ? (
                <Button
                  variant="danger"
                  className="w-full"
                  onClick={() => {
                    leaveCompetition(selectedComp.id)
                    setSelectedComp(null)
                  }}
                >
                  Withdraw from Tournament
                </Button>
              ) : (
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    joinCompetition(selectedComp.id)
                    setSelectedComp(null)
                  }}
                >
                  Register Arena Pass (+75 XP)
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
