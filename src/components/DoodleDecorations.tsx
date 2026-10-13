import React from 'react'
import { motion } from 'framer-motion'

export function PixelSwordDoodle({ className = '' }: { className?: string }) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0], rotate: [0, 5, -3, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className={`select-none pointer-events-none ${className}`}
    >
      <svg width="42" height="42" viewBox="0 0 32 32" fill="none">
        {/* Pixel / Arcade Sword Doodle */}
        <rect x="22" y="2" width="4" height="4" fill="#836EF9" />
        <rect x="20" y="4" width="4" height="4" fill="#A78BFA" />
        <rect x="18" y="6" width="4" height="4" fill="#FFFFFF" />
        <rect x="16" y="8" width="4" height="4" fill="#A78BFA" />
        <rect x="14" y="10" width="4" height="4" fill="#FFFFFF" />
        <rect x="12" y="12" width="4" height="4" fill="#836EF9" />
        <rect x="10" y="14" width="4" height="4" fill="#A78BFA" />
        {/* Crossguard */}
        <rect x="6" y="16" width="4" height="4" fill="#FBBF24" />
        <rect x="8" y="16" width="12" height="4" fill="#F59E0B" />
        <rect x="16" y="14" width="4" height="8" fill="#FBBF24" />
        {/* Handle */}
        <rect x="6" y="20" width="4" height="4" fill="#B45309" />
        <rect x="4" y="22" width="4" height="4" fill="#78350F" />
        <rect x="2" y="24" width="4" height="4" fill="#FBBF24" />
      </svg>
    </motion.div>
  )
}

export function StarBadgeDoodle({ className = '' }: { className?: string }) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      className={`select-none pointer-events-none ${className}`}
    >
      <svg width="44" height="44" viewBox="0 0 36 36" fill="none">
        {/* Retro Gaming Star Crest */}
        <circle cx="18" cy="18" r="16" fill="#1E2238" stroke="#FBBF24" strokeWidth="2.5" />
        <circle cx="18" cy="18" r="12" fill="#FBBF24" opacity="0.15" />
        <path
          d="M 18 8 L 21 14 L 27 15 L 22.5 19.5 L 24 26 L 18 22.5 L 12 26 L 13.5 19.5 L 9 15 L 15 14 Z"
          fill="#FBBF24"
          stroke="#F59E0B"
          strokeWidth="1.2"
        />
        <circle cx="18" cy="18" r="2" fill="#FFFFFF" />
      </svg>
    </motion.div>
  )
}

export function MonadCrystalDoodle({ className = '' }: { className?: string }) {
  return (
    <motion.div
      animate={{ y: [0, -6, 0], rotate: [0, 360] }}
      transition={{
        y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: 25, repeat: Infinity, ease: 'linear' },
      }}
      className={`select-none pointer-events-none ${className}`}
    >
      <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
        {/* Monad Purple Gem */}
        <polygon points="16,2 28,10 28,22 16,30 4,22 4,10" fill="#17192C" stroke="#836EF9" strokeWidth="2" />
        <polygon points="16,6 24,12 24,20 16,26 8,20 8,12" fill="#836EF9" opacity="0.3" />
        <circle cx="16" cy="16" r="3" fill="#FFFFFF" />
      </svg>
    </motion.div>
  )
}

export function DoodleRobotMini({ className = '' }: { className?: string }) {
  return (
    <motion.div
      animate={{ y: [0, -7, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      className={`select-none pointer-events-none ${className}`}
    >
      <svg width="36" height="40" viewBox="0 0 30 36" fill="none">
        {/* Mini line art bot from Image 4 */}
        <circle cx="15" cy="5" r="2" fill="#10B981" />
        <line x1="15" y1="5" x2="15" y2="10" stroke="#F8FAFC" strokeWidth="1.5" />
        <rect x="7" y="10" width="16" height="13" rx="4" fill="#16192A" stroke="#F8FAFC" strokeWidth="2" />
        <circle cx="11" cy="16" r="1.5" fill="#10B981" />
        <circle cx="19" cy="16" r="1.5" fill="#10B981" />
        <path d="M 12 20 Q 15 22 18 20" stroke="#F8FAFC" strokeWidth="1.2" fill="none" />
        <rect x="9" y="24" width="12" height="6" rx="2" fill="#1F243B" stroke="#F8FAFC" strokeWidth="1.5" />
        <circle cx="15" cy="33" r="3" fill="#836EF9" stroke="#F8FAFC" strokeWidth="1.5" />
      </svg>
    </motion.div>
  )
}
