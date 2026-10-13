import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Target,
  Flame,
  Lock,
  CheckCircle2,
  ChevronRight,
  Star,
  Award,
  Sparkles,
} from 'lucide-react'
import { Card, Badge, Tabs, ProgressBar, Modal, Button } from '../components/ui'
import { useAppStore } from '../store/useAppStore'
import ClashDoodleMascot from '../components/ClashDoodleMascot'

const CATEGORY_COLORS: Record<string, string> = {
  trading: '#836EF9',
  learning: '#10B981',
  social: '#F59E0B',
  risk: '#FF4D6D',
}

function MissionCard({
  mission,
  onSelect,
}: {
  mission: any
  onSelect: (m: any) => void
}) {
  const { completeMission } = useAppStore()
  const catColor = CATEGORY_COLORS[mission.category] || '#836EF9'
  const isClaimable = !mission.completed && !mission.locked && mission.progress >= mission.target

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!mission.locked && !mission.completed ? { y: -2 } : {}}
      className={`p-4.5 rounded-2xl border transition-all cursor-pointer ${
        mission.completed
          ? 'bg-tactile-mint/5 border-tactile-mint/20'
          : mission.locked
          ? 'bg-bg-secondary/40 border-white/5 opacity-60'
          : 'tactile-glass border-white/[0.08] hover:border-brand-violet/30'
      }`}
      onClick={() => !mission.locked && onSelect(mission)}
    >
      <div className="flex items-start gap-3.5">
        <div className="text-2xl flex-shrink-0 mt-0.5">{mission.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-sm text-text-primary font-display">
              {mission.title}
            </span>
            {mission.locked && <Lock size={12} className="text-text-muted flex-shrink-0" />}
            {mission.completed && (
              <CheckCircle2 size={14} className="text-tactile-mint flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-text-secondary mb-2.5 leading-relaxed">
            {mission.description}
          </p>

          {!mission.locked && !mission.completed && (
            <ProgressBar
              value={mission.progress}
              max={mission.target}
              color={catColor}
              height="h-1.5"
              showLabel
            />
          )}

          {mission.completed && (
            <span className="text-xs text-tactile-mint font-semibold flex items-center gap-1">
              <CheckCircle2 size={12} /> Reward Claimed
            </span>
          )}
        </div>

        <div className="text-right flex-shrink-0">
          <div className="text-xs font-bold text-brand-violet font-mono">
            +{mission.xpReward} XP
          </div>

          {isClaimable && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                completeMission(mission.id)
              }}
              className="mt-2 text-xs font-bold px-3 py-1 rounded-full bg-brand-violet text-white shadow-pill-active hover:scale-105 transition-transform cursor-pointer"
            >
              Claim!
            </button>
          )}

          {!mission.completed && !mission.locked && !isClaimable && (
            <span className="text-xs text-text-muted block mt-1 font-mono">
              {mission.progress}/{mission.target}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function StreakBanner() {
  const { streak, missions, hasClaimedDailyStreak, claimDailyStreak } = useAppStore()
  const dailyDone = missions.filter((m) => m.type === 'daily' && m.completed).length
  const dailyTotal = missions.filter((m) => m.type === 'daily').length

  return (
    <div className="tactile-glass rounded-2xl p-6 border border-white/[0.08] shadow-tactile-card relative overflow-hidden">
      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <ClashDoodleMascot size="md" mood="cheering" showSpeech={false} />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-black text-text-primary font-display">
                {streak} Day Winning Streak
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-accent-amber/15 text-accent-amber border border-accent-amber/30">
                Active
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Execute at least one disciplined trade daily to earn multiplier bonuses!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-black/30 border border-white/5 text-center min-w-[90px]">
            <span className="text-xl font-black text-tactile-mint font-display">
              {dailyDone}/{dailyTotal}
            </span>
            <span className="text-[10px] text-text-muted block">Quests Done</span>
          </div>

          <button
            onClick={claimDailyStreak}
            disabled={hasClaimedDailyStreak}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              hasClaimedDailyStreak
                ? 'bg-white/5 text-text-muted cursor-not-allowed'
                : 'bg-accent-amber/20 hover:bg-accent-amber/30 text-accent-amber border border-accent-amber/30 shadow-sm active:scale-95'
            }`}
          >
            {hasClaimedDailyStreak ? 'Streak Bonus Claimed ✓' : 'Claim Daily +150 XP 🔥'}
          </button>
        </div>
      </div>

      {/* 7-Day Calendar Strip */}
      <div className="grid grid-cols-7 gap-2 mt-5 pt-4 border-t border-white/5">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
          <div key={d} className="text-center">
            <span className="text-[10px] text-text-muted mb-1 block font-medium">{d}</span>
            <div
              className={`py-1.5 rounded-lg text-xs font-bold flex items-center justify-center ${
                i < 3
                  ? 'bg-accent-amber/15 text-accent-amber border border-accent-amber/30'
                  : i === 3
                  ? 'bg-brand-violet/20 text-brand-violet border border-brand-violet/40 ring-1 ring-brand-violet'
                  : 'bg-black/30 text-text-muted border border-white/5'
              }`}
            >
              {i <= 3 ? '✓' : '•'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Missions() {
  const { missions } = useAppStore()
  const [activeTab, setActiveTab] = useState('Daily')
  const [selectedMission, setSelectedMission] = useState<any>(null)

  const filtered = missions.filter((m) => m.type === activeTab.toLowerCase())

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-text-primary font-display">
          Missions & Quests
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
          Level up your player card, earn XP, and unlock exclusive tournament passes.
        </p>
      </div>

      <StreakBanner />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3">
        {['Daily', 'Weekly', 'Seasonal'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-brand-violet/20 text-brand-violet border border-brand-violet/30 shadow-sm'
                : 'text-text-muted hover:text-text-primary bg-white/[0.03]'
            }`}
          >
            {tab} Quests
          </button>
        ))}
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((m) => (
          <MissionCard key={m.id} mission={m} onSelect={setSelectedMission} />
        ))}
      </div>

      {/* Detail Modal */}
      {selectedMission && (
        <Modal
          open={!!selectedMission}
          onClose={() => setSelectedMission(null)}
          title={selectedMission.title}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{selectedMission.icon}</span>
              <div>
                <p className="text-sm text-text-secondary">{selectedMission.description}</p>
                <span className="text-xs font-bold text-brand-violet mt-1 block">
                  Reward: +{selectedMission.xpReward} XP
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between text-text-muted">
                <span>Category</span>
                <span className="capitalize font-semibold text-text-primary">
                  {selectedMission.category}
                </span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Progress</span>
                <span className="font-mono text-text-primary">
                  {selectedMission.progress} / {selectedMission.target}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
