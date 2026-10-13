import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  TrendingUp,
  Zap,
  Trophy,
  Target,
  Award,
  User,
  Settings,
  Swords,
  ChevronRight,
  Menu,
  X,
  Wallet,
  Activity,
  Droplets,
  Layers,
  Coins,
  Sun,
  Moon,
  Mail,
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { XPBar, LeagueBadge, Avatar } from './ui'
import { CURRENT_PLAYER } from '../data/mockData'
import ClashDoodleMascot from './ClashDoodleMascot'
import { getLevelTier } from '../lib/levels'

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'spot', label: 'Spot Arena', icon: TrendingUp, badge: 'Kuru' },
  { id: 'perps', label: 'Perps Arena', icon: Zap, badge: 'Perpl' },
  { id: 'agora', label: 'Agora AUSD', icon: Coins, badge: '5.25%' },
  { id: 'competitions', label: 'Competitions', icon: Swords },
  { id: 'missions', label: 'Missions', icon: Target, badge: 'XP' },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'achievements', label: 'Achievements', icon: Award },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
}

export default function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const {
    currentPage,
    setCurrentPage,
    xp,
    level,
    xpToNext,
    walletConnected,
    walletAddress,
    setIsWalletModalOpen,
    tradingMode,
    setTradingMode,
    requestFaucet,
    theme,
    toggleTheme,
    emailUser,
    setIsEmailAuthModalOpen,
  } = useAppStore()

  const tier = getLevelTier(level)

  const navigate = (page: string) => {
    setCurrentPage(page)
    setMobileOpen(false)
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-bg-secondary select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-white/[0.07] bg-bg-primary/40">
        <div
          onClick={() => navigate('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-violet to-brand-purple flex items-center justify-center flex-shrink-0 shadow-pill-active group-hover:scale-105 transition-transform">
            <Swords size={18} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black text-text-primary tracking-tight font-display">
                MonClash
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-brand-violet/20 text-brand-violet border border-brand-violet/30">
                v1.0
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-text-secondary mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-tactile-mint animate-pulse" />
              <span>Monad Testnet</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mascot & Player Progress Card */}
      <div className="p-4 border-b border-white/[0.07] bg-gradient-to-b from-bg-card/40 to-transparent">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative">
              <Avatar initials={emailUser?.username ? emailUser.username.slice(0, 2).toUpperCase() : CURRENT_PLAYER.avatar} size="md" level={level} />
              <div
                className="absolute -bottom-1 -right-1 text-[9px] font-black text-white px-1 py-0.2 rounded-full"
                style={{ backgroundColor: tier.color }}
              >
                {tier.badge}
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-text-primary truncate">
                {emailUser?.username || CURRENT_PLAYER.username}
              </p>
              <span
                className="text-[10px] font-bold block truncate"
                style={{ color: tier.color }}
              >
                {tier.title} (Lv.{level})
              </span>
            </div>
          </div>
          {/* Mini Mascot companion */}
          <div className="flex-shrink-0">
            <ClashDoodleMascot
              size="sm"
              showSpeech={false}
              interactive={true}
            />
          </div>
        </div>

        <XPBar xp={xp} xpToNext={xpToNext} level={level} compact />

        {/* Demo / Live Mode Selector Pill */}
        <div className="mt-3 flex rounded-lg p-0.5 bg-black/40 border border-white/5 text-[11px]">
          <button
            onClick={() => setTradingMode('demo')}
            className={`flex-1 py-1 px-2 rounded-md font-semibold transition-all ${
              tradingMode === 'demo'
                ? 'bg-accent-amber/20 text-accent-amber shadow-sm border border-accent-amber/30'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            Demo ($10K)
          </button>
          <button
            onClick={() => setTradingMode('live')}
            className={`flex-1 py-1 px-2 rounded-md font-semibold transition-all ${
              tradingMode === 'live'
                ? 'bg-brand-violet/20 text-brand-violet shadow-sm border border-brand-violet/30'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            Monad Live
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 overflow-y-auto space-y-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon, badge }) => {
          const active = currentPage === id
          return (
            <motion.button
              key={id}
              onClick={() => navigate(id)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group cursor-pointer ${
                active
                  ? 'bg-brand-violet/15 text-brand-violet border border-brand-violet/25 shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  size={16}
                  className={
                    active
                      ? 'text-brand-violet'
                      : 'text-text-muted group-hover:text-text-primary'
                  }
                />
                <span>{label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white/5 text-text-muted group-hover:text-text-secondary border border-white/5">
                    {badge}
                  </span>
                )}
                {active && <ChevronRight size={13} className="text-brand-violet/60" />}
              </div>
            </motion.button>
          )
        })}
      </nav>

      {/* Wallet Status, Theme Toggle & Faucet Footer */}
      <div className="p-3 border-t border-white/[0.07] bg-bg-primary/50 space-y-2">
        <button
          onClick={() => setIsWalletModalOpen(true)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
            walletConnected
              ? 'bg-tactile-mint/10 border-tactile-mint/30 text-tactile-mint shadow-pill-mint'
              : 'bg-brand-violet/10 hover:bg-brand-violet/20 border-brand-violet/30 text-brand-violet shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            <Wallet size={14} />
            <span className="truncate">
              {walletConnected
                ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                : 'Connect Wallet'}
            </span>
          </div>
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 ${
              walletConnected ? 'bg-tactile-mint animate-pulse' : 'bg-brand-violet'
            }`}
          />
        </button>

        {/* Theme Switcher & Email Auth Row */}
        <div className="flex gap-1.5">
          <button
            onClick={toggleTheme}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-semibold text-text-muted hover:text-text-primary bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun size={12} className="text-accent-amber" /> : <Moon size={12} className="text-brand-violet" />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          {!walletConnected && (
            <button
              onClick={() => setIsEmailAuthModalOpen(true)}
              className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-tactile-mint bg-tactile-mint/10 hover:bg-tactile-mint/20 border border-tactile-mint/25 transition-colors cursor-pointer"
            >
              <Mail size={12} /> Email
            </button>
          )}
        </div>

        {/* Faucet quick button */}
        <button
          onClick={requestFaucet}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-medium text-text-muted hover:text-text-primary bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 transition-colors cursor-pointer"
        >
          <Droplets size={12} className="text-accent-sky" />
          <span>Get Monad Faucet Funds</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 xl:w-64 bg-bg-secondary border-r border-white/[0.07] h-screen flex-shrink-0 sticky top-0 z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/75 z-40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-bg-secondary border-r border-white/10 z-50 shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Mobile Header ────────────────────────────────────────────────────────────

interface HeaderProps {
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
}

export function MobileHeader({ mobileOpen, setMobileOpen }: HeaderProps) {
  const {
    currentPage,
    setIsWalletModalOpen,
    walletConnected,
    theme,
    toggleTheme,
    setIsEmailAuthModalOpen,
  } = useAppStore()
  const page = NAV_ITEMS.find((n) => n.id === currentPage)

  return (
    <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-bg-secondary/90 backdrop-blur-xl border-b border-white/[0.07]">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg hover:bg-white/5 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-violet to-brand-purple flex items-center justify-center">
            <Swords size={14} className="text-white" />
          </div>
          <span className="font-bold text-sm text-text-primary font-display">MonClash</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg hover:bg-white/5 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={15} className="text-accent-amber" /> : <Moon size={15} className="text-brand-violet" />}
        </button>
        {!walletConnected && (
          <button
            onClick={() => setIsEmailAuthModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-tactile-mint/10 border border-tactile-mint/30 text-tactile-mint cursor-pointer"
          >
            <Mail size={12} />
            <span>Email</span>
          </button>
        )}
        <button
          onClick={() => setIsWalletModalOpen(true)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border cursor-pointer ${
            walletConnected
              ? 'bg-tactile-mint/10 border-tactile-mint/30 text-tactile-mint'
              : 'bg-brand-violet/10 border-brand-violet/30 text-brand-violet'
          }`}
        >
          <Wallet size={12} />
          <span>{walletConnected ? 'Connected' : 'Connect'}</span>
        </button>
      </div>
    </header>
  )
}
