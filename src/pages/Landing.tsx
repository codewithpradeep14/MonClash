import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp,
  Zap,
  Trophy,
  Target,
  Swords,
  ArrowRight,
  ChevronDown,
  Star,
  Award,
  Shield,
  Users,
  Wallet,
  Activity,
  Droplets,
  CheckCircle2,
  ExternalLink,
  Flame,
  Mail,
} from 'lucide-react'
import { Button, LeagueBadge, Badge } from '../components/ui'
import { PLAYERS, MARKETS } from '../data/mockData'
import { useAppStore } from '../store/useAppStore'
import ClashDoodleMascot, { type MascotMood } from '../components/ClashDoodleMascot'
import LiveTactilePills, { LiveTactilePill } from '../components/LiveTactilePills'
import {
  PixelSwordDoodle,
  StarBadgeDoodle,
  MonadCrystalDoodle,
  DoodleRobotMini,
} from '../components/DoodleDecorations'
import { ECOSYSTEM_INTEGRATIONS } from '../lib/web3/monadConfig'

const TICKER = [...MARKETS, ...MARKETS]

function TickerBar() {
  return (
    <div className="border-y border-white/[0.07] bg-bg-secondary/60 backdrop-blur-md py-2 overflow-hidden select-none">
      <div className="flex animate-ticker" style={{ width: 'max-content' }}>
        {[...TICKER, ...TICKER].map((m, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 px-6 border-r border-white/[0.06] whitespace-nowrap"
          >
            <span className="text-text-muted text-xs font-mono font-semibold">
              {m.symbol}
            </span>
            <span className="text-xs font-bold text-text-primary">
              ${m.price < 1 ? m.price.toFixed(4) : m.price < 100 ? m.price.toFixed(2) : m.price.toFixed(0)}
            </span>
            <span
              className={`text-[11px] font-bold ${
                m.change24h >= 0 ? 'text-tactile-mint' : 'text-negative'
              }`}
            >
              {m.change24h >= 0 ? '+' : ''}
              {m.change24h.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function HeroSection({ onEnter }: { onEnter: () => void }) {
  const {
    addXP,
    addToast,
    setIsWalletModalOpen,
    walletConnected,
    setIsEmailAuthModalOpen,
  } = useAppStore()
  const [mascotMood, setMascotMood] = useState<MascotMood>('idle')
  const [miniPnl, setMiniPnl] = useState(1420.5)
  const [tradeCount, setTradeCount] = useState(0)

  // Interactive instant micro-trade test directly in Hero
  const handleQuickHeroTrade = (type: 'buy' | 'long') => {
    setMascotMood('cheering')
    setMiniPnl((prev) => prev + (type === 'buy' ? 42.5 : 85.0))
    setTradeCount((prev) => prev + 1)
    addXP(30)
    addToast(
      type === 'buy'
        ? '⚡ Kuru CLOB: Filled 10 MON at market! +30 XP'
        : '🛡️ Perpl Arena: Opened 5x Long MON-PERP! +30 XP',
      'xp',
      30
    )
    setTimeout(() => setMascotMood('idle'), 2500)
  }

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center pt-28 pb-16 px-4 sm:px-6 overflow-hidden">
      {/* Background Soft Directional Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-brand-violet/[0.07] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/6 w-[350px] h-[350px] bg-tactile-mint/[0.04] rounded-full blur-[120px] pointer-events-none" />

      {/* Floating Animated Doodles in Background */}
      <PixelSwordDoodle className="hidden xl:block absolute top-36 left-[7%]" />
      <StarBadgeDoodle className="hidden xl:block absolute top-48 right-[8%]" />
      <MonadCrystalDoodle className="hidden xl:block absolute bottom-32 left-[10%]" />
      <DoodleRobotMini className="hidden xl:block absolute bottom-36 right-[11%]" />

      {/* Live Tactile Status Pills (Maltea Style) */}
      <div className="relative z-10 mb-8">
        <LiveTactilePills />
      </div>

      {/* Main Hero Header */}
      <div className="relative z-10 text-center max-w-4xl mx-auto space-y-6">
        {/* Season & Monad Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-semibold bg-brand-violet/10 border border-brand-violet/25 text-brand-violet shadow-sm">
          <Star size={13} className="text-accent-gold" />
          <span>Metropolis Hackathon Edition • Monad Devnet & Testnet</span>
        </div>

        {/* Big Editorial Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-text-primary tracking-tight leading-[1.05] font-display">
          Trade. Compete.{' '}
          <span className="text-gradient-iris font-editorial">Conquer.</span>
        </h1>

        {/* Tagline & Subheading */}
        <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          The gamified trading arena on <strong className="text-text-primary font-bold">Monad</strong>.
          One arena, two trading styles (Spot & Perps), and one player identity.
          Earn XP, climb leagues, and trade without pending-state lag.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Button size="lg" onClick={onEnter} className="w-full sm:w-auto shadow-pill-active">
            <span>Enter the Arena</span>
            <ArrowRight size={18} />
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => setIsWalletModalOpen(true)}
            className="w-full sm:w-auto"
          >
            <Wallet size={16} />
            <span>{walletConnected ? 'Wallet Connected' : 'Connect Wallet'}</span>
          </Button>

          <button
            onClick={() => setIsEmailAuthModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-tactile-mint hover:text-white bg-tactile-mint/10 hover:bg-tactile-mint border border-tactile-mint/30 shadow-sm transition-all cursor-pointer"
          >
            <Mail size={15} />
            <span>Sign in with Email</span>
          </button>
        </div>

        {/* Interactive Playable Terminal & Mascot Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="pt-8 max-w-2xl mx-auto"
        >
          <div className="tactile-glass rounded-2xl p-5 border border-white/[0.09] shadow-tactile-card">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Mascot Companion (Image 4 doodle style) */}
              <div className="flex items-center gap-3">
                <ClashDoodleMascot
                  mood={mascotMood}
                  size="md"
                  showSpeech={true}
                  customSpeech={
                    mascotMood === 'cheering'
                      ? 'WOOHOO! +30 XP claimed on Monad parallel engine!'
                      : 'Try clicking a quick trade below to see me celebrate!'
                  }
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                    <span>MonBot Companion</span>
                    <span className="w-2 h-2 rounded-full bg-tactile-mint animate-pulse" />
                  </div>
                  <p className="text-[11px] text-text-secondary">
                    Your onchain trading guide & XP referee
                  </p>
                  <div className="mt-1 text-xs font-mono font-semibold text-tactile-mint">
                    Demo PnL: +${miniPnl.toFixed(2)} ({tradeCount} trades)
                  </div>
                </div>
              </div>

              {/* Playable Quick Trade Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleQuickHeroTrade('buy')}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-tactile-mint/15 hover:bg-tactile-mint/25 text-tactile-mint border border-tactile-mint/30 shadow-pill-mint transition-all active:scale-95 cursor-pointer"
                >
                  <TrendingUp size={14} /> Quick Spot (Kuru)
                </button>
                <button
                  onClick={() => handleQuickHeroTrade('long')}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-violet/15 hover:bg-brand-violet/25 text-brand-violet border border-brand-violet/30 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Zap size={14} /> Quick Perp 5x (Perpl)
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function FeaturesSection({ onEnter }: { onEnter: () => void }) {
  const arenas = [
    {
      id: 'spot',
      title: 'Spot Arena',
      badge: 'Kuru CLOB Engine',
      description:
        'Sub-second onchain central limit order book trading. Experience zero pending states, deep bid-ask spreads, and institutional-grade order execution on Monad.',
      stats: ['0ms Pending Lag', '400ms Block Slot', '0.02% Taker Fee'],
      color: 'mint',
      icon: TrendingUp,
      actionText: 'Launch Spot Arena',
    },
    {
      id: 'perps',
      title: 'Perps Arena',
      badge: 'Perpl High-Frequency Core',
      description:
        'Leveraged perpetuals with dynamic margin risk protection. Long or short major crypto assets with up to 50x leverage, real-time liquidation alerts, and 8h funding streams.',
      stats: ['Up to 50x Leverage', 'Dynamic Risk Guard', 'Funding Oracles'],
      color: 'iris',
      icon: Zap,
      actionText: 'Launch Perps Arena',
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-violet bg-brand-violet/10 px-3 py-1 rounded-full border border-brand-violet/20">
          Two Arenas • One Identity
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary tracking-tight font-display">
          Crafted for high performance.
        </h2>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Spot and perpetual performance remain distinct in your profile, ensuring both disciplined spot traders and high-conviction perp specialists can dominate their respective ranks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {arenas.map((arena) => {
          const Icon = arena.icon
          const isMint = arena.color === 'mint'
          return (
            <motion.div
              key={arena.id}
              whileHover={{ y: -4 }}
              className="tactile-glass rounded-2xl p-6 sm:p-7 border border-white/[0.08] shadow-tactile-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      isMint
                        ? 'bg-tactile-mint/10 text-tactile-mint border-tactile-mint/30'
                        : 'bg-brand-violet/10 text-brand-violet border-brand-violet/30'
                    }`}
                  >
                    {arena.badge}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isMint
                        ? 'bg-tactile-mint/15 text-tactile-mint'
                        : 'bg-brand-violet/15 text-brand-violet'
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-text-primary mb-2 font-display">
                  {arena.title}
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
                  {arena.description}
                </p>

                <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                  {arena.stats.map((s, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                      <span className="text-[11px] font-bold text-text-primary">{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant={isMint ? 'success' : 'primary'}
                onClick={onEnter}
                className="w-full"
              >
                <span>{arena.actionText}</span>
                <ArrowRight size={15} />
              </Button>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

function GamificationSection() {
  const leagues = [
    { name: 'Bronze', pts: '0 - 1,000 XP', icon: '🥉', color: '#CD7F32' },
    { name: 'Silver', pts: '1,000 - 3,500 XP', icon: '🥈', color: '#C0C0C0' },
    { name: 'Gold', pts: '3,500 - 7,500 XP', icon: '🥇', color: '#FBBF24' },
    { name: 'Platinum', pts: '7,500 - 15,000 XP', icon: '💎', color: '#38BDF8' },
    { name: 'Diamond', pts: '15,000+ XP', icon: '👑', color: '#836EF9' },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 bg-bg-secondary/40 border-y border-white/[0.05]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-accent-amber bg-accent-amber/10 px-3 py-1 rounded-full border border-accent-amber/20">
            Fair & Transparent Rules
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary tracking-tight font-display">
            Consistency beats reckless degening.
          </h2>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            MonClash league formulas prioritize risk-adjusted performance, trade win rate, and streak discipline rather than raw lottery leverage.
          </p>
        </div>

        {/* League Tiers Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-10">
          {leagues.map((lg) => (
            <div
              key={lg.name}
              className="tactile-glass rounded-2xl p-4 text-center border border-white/[0.07] hover:border-brand-violet/30 transition-all"
            >
              <div className="text-3xl mb-2">{lg.icon}</div>
              <h4 className="font-bold text-sm text-text-primary font-display">{lg.name}</h4>
              <p className="text-[11px] text-text-muted mt-0.5">{lg.pts}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function EcosystemSection() {
  return (
    <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-tactile-mint bg-tactile-mint/10 px-3 py-1 rounded-full border border-tactile-mint/20">
          Metropolis Ecosystem Partners
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight font-display">
          Verified protocol integrations.
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Each integration is architected modularly with truthful status indicators, adhering strictly to official SDKs and contracts.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(ECOSYSTEM_INTEGRATIONS).map(([key, item]) => (
          <div
            key={key}
            className="tactile-glass rounded-2xl p-5 border border-white/[0.08] flex flex-col justify-between hover:border-brand-violet/30 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  {item.category}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-tactile-mint/15 text-tactile-mint border border-tactile-mint/25">
                  ● {item.status}
                </span>
              </div>
              <h4 className="text-base font-bold text-text-primary font-display">{item.name}</h4>
              <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-mono text-brand-violet font-semibold">
                {item.version}
              </span>
              <a
                href={item.docsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Footer({ onEnter }: { onEnter: () => void }) {
  return (
    <footer className="border-t border-white/[0.08] py-12 px-4 sm:px-6 bg-bg-secondary/60 select-none">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-violet to-brand-purple flex items-center justify-center">
            <Swords size={16} className="text-white" />
          </div>
          <div>
            <span className="font-black text-sm text-text-primary font-display">MonClash</span>
            <p className="text-[11px] text-text-muted">Trade. Compete. Conquer. Built for Monad.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-text-secondary">
          <button onClick={onEnter} className="hover:text-text-primary transition-colors">
            Spot Arena
          </button>
          <button onClick={onEnter} className="hover:text-text-primary transition-colors">
            Perps Arena
          </button>
          <button onClick={onEnter} className="hover:text-text-primary transition-colors">
            Missions & Quests
          </button>
          <button onClick={onEnter} className="hover:text-text-primary transition-colors">
            Leaderboard
          </button>
        </div>

        <div className="text-[11px] text-text-muted">
          Metropolis Hackathon • Verified Architecture
        </div>
      </div>
    </footer>
  )
}

export default function Landing() {
  const { setCurrentPage, setIsWalletModalOpen, walletConnected } = useAppStore()

  const handleEnter = () => {
    setCurrentPage('dashboard')
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col selection:bg-brand-violet selection:text-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-bg-primary/80 backdrop-blur-xl border-b border-white/[0.06] px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div
            onClick={handleEnter}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-violet to-brand-purple flex items-center justify-center group-hover:scale-105 transition-transform shadow-pill-active">
              <Swords size={16} className="text-white" />
            </div>
            <span className="font-black text-lg text-text-primary tracking-tight font-display">
              MonClash
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsWalletModalOpen(true)}
              className="text-xs font-semibold px-3.5 py-1.5 rounded-xl border border-white/10 hover:border-brand-violet/40 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            >
              {walletConnected ? 'Wallet Connected' : 'Connect Wallet'}
            </button>
            <Button size="sm" onClick={handleEnter}>
              <span>Enter Arena</span>
              <ArrowRight size={13} />
            </Button>
          </div>
        </div>
      </nav>

      {/* Live Market Ticker */}
      <div className="pt-[58px]">
        <TickerBar />
      </div>

      {/* Hero Section */}
      <HeroSection onEnter={handleEnter} />

      {/* Core Arena Features */}
      <FeaturesSection onEnter={handleEnter} />

      {/* Gamification & Leagues */}
      <GamificationSection />

      {/* Verified Ecosystem */}
      <EcosystemSection />

      {/* Footer */}
      <Footer onEnter={handleEnter} />
    </div>
  )
}
