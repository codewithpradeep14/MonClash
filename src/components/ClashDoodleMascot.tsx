import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, MessageSquare, Zap, Shield, HelpCircle } from 'lucide-react'

export type MascotMood = 'idle' | 'trading' | 'cheering' | 'warning' | 'degen'

interface ClashDoodleMascotProps {
  mood?: MascotMood
  size?: 'sm' | 'md' | 'lg' | 'xl'
  interactive?: boolean
  showSpeech?: boolean
  className?: string
  customSpeech?: string
}

const ROBOT_QUOTES = [
  "Monad executes blocks in 400ms — faster than you can blink! ⚡",
  "Tip: High consistency gives more League points than reckless 50x leverage!",
  "Kuru's onchain CLOB gives tight spreads with zero pending state.",
  "Agora AUSD stability pool is looking solid today! 🛡️",
  "Complete your 3 daily missions to keep your XP streak burning! 🔥",
  "Checking the order book... bids are stacking up nicely on MON/USDC!",
  "Risk Management check: Never risk more than 5% of margin on a single perp!",
]

export default function ClashDoodleMascot({
  mood = 'idle',
  size = 'md',
  interactive = true,
  showSpeech = true,
  className = '',
  customSpeech,
}: ClashDoodleMascotProps) {
  const [currentMood, setCurrentMood] = useState<MascotMood>(mood)
  const [speechIndex, setSpeechIndex] = useState(0)
  const [speechBubbleOpen, setSpeechBubbleOpen] = useState(false)
  const [isWinking, setIsWinking] = useState(false)

  useEffect(() => {
    setCurrentMood(mood)
  }, [mood])

  // Random wink every 5-8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsWinking(true)
      setTimeout(() => setIsWinking(false), 240)
    }, 5000 + Math.random() * 3000)
    return () => clearInterval(interval)
  }, [])

  const handleMascotClick = () => {
    if (!interactive) return
    setSpeechIndex((prev) => (prev + 1) % ROBOT_QUOTES.length)
    setSpeechBubbleOpen(true)
    setIsWinking(true)
    setTimeout(() => setIsWinking(false), 300)
  }

  const dimensions = {
    sm: { w: 56, h: 64, scale: 0.7 },
    md: { w: 90, h: 104, scale: 1 },
    lg: { w: 130, h: 150, scale: 1.4 },
    xl: { w: 180, h: 210, scale: 2 },
  }[size]

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Interactive Speech Bubble */}
      <AnimatePresence>
        {(showSpeech || speechBubbleOpen) && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.9 }}
            className="absolute bottom-full mb-3 z-30 max-w-[210px] px-3 py-2 rounded-xl text-xs font-medium text-text-primary bg-bg-card/95 border border-brand-violet/30 shadow-xl backdrop-blur-md text-center pointer-events-auto"
          >
            <div className="flex items-center justify-between gap-1 mb-1 text-[10px] font-bold text-brand-violet uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Zap size={10} className="text-brand-violet" /> MonBot
              </span>
              <span className="text-text-muted text-[9px] cursor-pointer" onClick={() => setSpeechBubbleOpen(false)}>
                ✕
              </span>
            </div>
            <p className="leading-tight">{customSpeech || ROBOT_QUOTES[speechIndex]}</p>
            {/* Bubble Tail */}
            <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 bg-bg-card border-r border-b border-brand-violet/30 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot SVG Body */}
      <motion.div
        onClick={handleMascotClick}
        whileHover={interactive ? { scale: 1.05, y: -4 } : {}}
        whileTap={interactive ? { scale: 0.95 } : {}}
        className={`relative ${interactive ? 'cursor-pointer' : ''}`}
        style={{ width: dimensions.w, height: dimensions.h }}
      >
        <svg
          viewBox="0 0 100 115"
          className="w-full h-full overflow-visible drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
        >
          {/* Radio Waves from Antenna */}
          <motion.circle
            cx="50"
            cy="12"
            r="8"
            fill="none"
            stroke="#836EF9"
            strokeWidth="1.5"
            strokeDasharray="2 3"
            initial={{ opacity: 0.2, scale: 0.8 }}
            animate={{ opacity: [0.1, 0.7, 0], scale: [0.8, 1.8, 2.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.circle
            cx="50"
            cy="12"
            r="14"
            fill="none"
            stroke="#10B981"
            strokeWidth="1"
            initial={{ opacity: 0.2, scale: 0.8 }}
            animate={{ opacity: [0, 0.5, 0], scale: [1, 2, 2.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6, ease: 'easeOut' }}
          />

          {/* Antenna Ball & Stem */}
          <line x1="50" y1="26" x2="50" y2="12" stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="12" r="5" fill="#836EF9" stroke="#F8FAFC" strokeWidth="2.5" />
          <circle cx="50" cy="12" r="2" fill="#FFFFFF" />

          {/* Ears / Side Bolts */}
          <rect x="16" y="38" width="6" height="12" rx="3" fill="#6D55E0" stroke="#F8FAFC" strokeWidth="2" />
          <rect x="78" y="38" width="6" height="12" rx="3" fill="#6D55E0" stroke="#F8FAFC" strokeWidth="2" />

          {/* Main Robot Head (Clean rounded box inspired by Image 4 doodle) */}
          <rect
            x="22"
            y="26"
            width="56"
            height="44"
            rx="14"
            fill="#17192C"
            stroke="#F8FAFC"
            strokeWidth="3.2"
          />

          {/* Inner Screen Visor */}
          <rect
            x="28"
            y="32"
            width="44"
            height="30"
            rx="8"
            fill="#0D0E17"
            stroke="rgba(131, 110, 249, 0.4)"
            strokeWidth="1.5"
          />

          {/* Eyes & Expressions */}
          {currentMood === 'cheering' ? (
            /* Star Eyes ★ ★ */
            <g fill="#FBBF24">
              <path d="M 38 42 L 40 47 L 45 47 L 41 50 L 43 55 L 38 52 L 34 55 L 36 50 L 32 47 L 37 47 Z" />
              <path d="M 61 42 L 63 47 L 68 47 L 64 50 L 66 55 L 61 52 L 57 55 L 59 50 L 55 47 L 60 47 Z" />
            </g>
          ) : currentMood === 'warning' ? (
            /* Cautious Squint Eyes & Sweat Drop */
            <g>
              <line x1="34" y1="46" x2="44" y2="46" stroke="#FF4D6D" strokeWidth="3" strokeLinecap="round" />
              <line x1="56" y1="46" x2="66" y2="46" stroke="#FF4D6D" strokeWidth="3" strokeLinecap="round" />
              {/* Sweat drop */}
              <path d="M 72 32 C 70 35 69 38 72 40 C 74 40 75 38 73 34 Z" fill="#38BDF8" />
            </g>
          ) : isWinking ? (
            /* Winking Eye Expression */
            <g>
              <circle cx="39" cy="46" r="4.5" fill="#10B981" />
              <path d="M 57 47 Q 62 43 67 47" stroke="#10B981" strokeWidth="3" strokeLinecap="round" fill="none" />
            </g>
          ) : (
            /* Default Friendly Bright LED Eyes */
            <g fill="#10B981">
              <circle cx="39" cy="46" r="4.5" />
              <circle cx="61" cy="46" r="4.5" />
              {/* Specular White Highlights */}
              <circle cx="41" cy="44" r="1.5" fill="#FFFFFF" />
              <circle cx="63" cy="44" r="1.5" fill="#FFFFFF" />
            </g>
          )}

          {/* Cute Robot Smile */}
          <path
            d="M 44 54 Q 50 58 56 54"
            fill="none"
            stroke="#F8FAFC"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Neck Segment */}
          <rect x="44" y="70" width="12" height="6" rx="2" fill="#836EF9" stroke="#F8FAFC" strokeWidth="2" />

          {/* Robot Torso / Chassis */}
          <path
            d="M 30 76 L 70 76 L 66 96 L 34 96 Z"
            fill="#1E2238"
            stroke="#F8FAFC"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Chest Gauge / Heart Indicator */}
          <circle cx="50" cy="85" r="5" fill="#836EF9" />
          <circle cx="50" cy="85" r="2.5" fill="#FFFFFF" className="animate-pulse" />

          {/* Mechanical Left Arm (Waving!) */}
          <motion.g
            animate={{ rotate: [0, -12, 10, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originX: '28px', originY: '78px' }}
          >
            <path
              d="M 28 80 C 18 82 14 74 12 66"
              fill="none"
              stroke="#F8FAFC"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            {/* Claws */}
            <circle cx="12" cy="65" r="4.5" fill="#6D55E0" stroke="#F8FAFC" strokeWidth="2" />
          </motion.g>

          {/* Mechanical Right Arm */}
          <motion.g
            animate={{ rotate: [0, 8, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originX: '72px', originY: '78px' }}
          >
            <path
              d="M 72 80 C 82 84 86 90 88 94"
              fill="none"
              stroke="#F8FAFC"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            {/* Hand holding a mini crypto crystal */}
            <circle cx="88" cy="94" r="4.5" fill="#10B981" stroke="#F8FAFC" strokeWidth="2" />
          </motion.g>

          {/* Hover Thruster (Instead of legs, a sleek anti-grav booster!) */}
          <path
            d="M 40 96 L 60 96 L 56 102 L 44 102 Z"
            fill="#2A2F4C"
            stroke="#F8FAFC"
            strokeWidth="2"
          />

          {/* Plasma Propulsion Flame (Animated) */}
          <motion.path
            d="M 44 102 Q 50 114 56 102 Z"
            fill="#836EF9"
            animate={{
              d: [
                'M 44 102 Q 50 114 56 102 Z',
                'M 44 102 Q 50 118 56 102 Z',
                'M 44 102 Q 50 112 56 102 Z',
              ],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{ duration: 0.35, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            d="M 47 102 Q 50 110 53 102 Z"
            fill="#FFFFFF"
            animate={{
              d: [
                'M 47 102 Q 50 110 53 102 Z',
                'M 47 102 Q 50 113 53 102 Z',
                'M 47 102 Q 50 109 53 102 Z',
              ],
            }}
            transition={{ duration: 0.25, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>

        {/* Small floating badge */}
        <div className="absolute -bottom-1 -right-2 px-1.5 py-0.5 rounded-full bg-brand-violet text-[9px] font-bold text-white shadow-md border border-white/20">
          Lv.{mood === 'cheering' ? '5' : '4'}
        </div>
      </motion.div>
    </div>
  )
}
