import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Award,
  Lock,
  Star,
  Zap,
  Trophy,
  Shield,
  TrendingUp,
  Users,
  CheckCircle2,
} from 'lucide-react'
import { Card, Badge, Modal, ProgressBar, Button } from '../components/ui'
import { useAppStore } from '../store/useAppStore'
import ClashDoodleMascot from '../components/ClashDoodleMascot'

const RARITY_CONFIG = {
  common: {
    label: 'Common',
    color: '#94A3B8',
    bg: 'rgba(148,163,184,0.08)',
    border: 'rgba(148,163,184,0.2)',
  },
  rare: {
    label: 'Rare',
    color: '#38BDF8',
    bg: 'rgba(56,189,248,0.08)',
    border: 'rgba(56,189,248,0.25)',
  },
  epic: {
    label: 'Epic',
    color: '#836EF9',
    bg: 'rgba(131,110,249,0.1)',
    border: 'rgba(131,110,249,0.3)',
  },
  legendary: {
    label: 'Legendary',
    color: '#FBBF24',
    bg: 'rgba(251,191,36,0.1)',
    border: 'rgba(251,191,36,0.3)',
  },
}

const CATEGORIES = ['All', 'Trading', 'Perps', 'Risk', 'Competitions', 'Leaderboard']

function AchievementCard({ ach, onClick }: { ach: any; onClick: () => void }) {
  const cfg = RARITY_CONFIG[ach.rarity as keyof typeof RARITY_CONFIG] || RARITY_CONFIG.common

  return (
    <motion.div
      whileHover={ach.unlocked ? { scale: 1.02, y: -2 } : {}}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`tactile-glass rounded-2xl p-4.5 border transition-all cursor-pointer relative ${
        ach.unlocked ? 'border-white/[0.09] shadow-tactile-card' : 'opacity-60 border-white/5'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
          style={{ color: cfg.color, borderColor: cfg.border, background: cfg.bg }}
        >
          {cfg.label}
        </span>
        {ach.unlocked ? (
          <CheckCircle2 size={13} className="text-tactile-mint" />
        ) : (
          <Lock size={12} className="text-text-muted" />
        )}
      </div>

      <div className="text-center my-3">
        <div className={`text-4xl mb-2 ${!ach.unlocked ? 'grayscale opacity-40' : ''}`}>
          {ach.icon}
        </div>
        <h4 className="font-bold text-sm text-text-primary font-display">{ach.title}</h4>
        <p className="text-[11px] text-text-muted mt-1 line-clamp-2 leading-relaxed">
          {ach.description}
        </p>
      </div>

      <div className="pt-2 border-t border-white/5 text-center">
        <span className="text-xs font-bold font-mono" style={{ color: cfg.color }}>
          +{ach.xpReward} XP
        </span>
      </div>
    </motion.div>
  )
}

export default function AchievementsPage() {
  const { achievements, unlockAchievement } = useAppStore()
  const [selectedAch, setSelectedAch] = useState<any>(null)
  const [activeCat, setActiveCat] = useState('All')

  const unlockedCount = achievements.filter((a) => a.unlocked).length

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary font-display">
            Badges & Achievements
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Proof of trading mastery, risk discipline, and tournament podium finishes.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-brand-violet/15 border border-brand-violet/30 text-xs font-bold text-brand-violet font-mono">
          <Award size={14} />
          <span>
            {unlockedCount} / {achievements.length} Unlocked
          </span>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCat === cat
                ? 'bg-brand-violet/20 text-brand-violet border border-brand-violet/30 shadow-sm'
                : 'bg-white/5 text-text-muted hover:text-text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {achievements.map((ach) => (
          <AchievementCard
            key={ach.id}
            ach={ach}
            onClick={() => setSelectedAch(ach)}
          />
        ))}
      </div>

      {/* Modal */}
      {selectedAch && (
        <Modal
          open={!!selectedAch}
          onClose={() => setSelectedAch(null)}
          title={selectedAch.title}
        >
          <div className="text-center space-y-4">
            <div className="text-5xl">{selectedAch.icon}</div>
            <div>
              <p className="text-xs text-text-secondary">{selectedAch.description}</p>
              <span className="text-xs font-bold text-brand-violet block mt-2 font-mono">
                Reward: +{selectedAch.xpReward} XP
              </span>
            </div>

            {!selectedAch.unlocked && (
              <Button
                variant="primary"
                onClick={() => {
                  unlockAchievement(selectedAch.id)
                  setSelectedAch(null)
                }}
                className="w-full"
              >
                <span>Unlock & Claim (+{selectedAch.xpReward} XP)</span>
              </Button>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
