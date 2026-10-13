import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings,
  Wallet,
  Bell,
  Shield,
  ChevronRight,
  Copy,
  ExternalLink,
  Globe,
  Droplets,
  LogOut,
  CheckCircle2,
  Sliders,
  Sparkles,
} from 'lucide-react'
import { Card, Button, Badge, DemoBadge } from '../components/ui'
import { useAppStore } from '../store/useAppStore'
import { MONAD_TESTNET, ECOSYSTEM_INTEGRATIONS } from '../lib/web3/monadConfig'

function WalletSection() {
  const {
    walletConnected,
    walletAddress,
    walletType,
    walletBalances,
    setIsWalletModalOpen,
    disconnectWallet,
    requestFaucet,
    addToast,
    tradingMode,
    setTradingMode,
  } = useAppStore()

  const handleCopy = () => {
    if (!walletAddress) return
    navigator.clipboard.writeText(walletAddress)
    addToast('Address copied to clipboard!', 'info')
  }

  return (
    <div className="tactile-glass rounded-2xl p-5 sm:p-6 border border-white/[0.08] shadow-tactile-card space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Wallet size={18} className="text-brand-violet" />
          <h2 className="font-bold text-base text-text-primary font-display">
            Monad Web3 Account
          </h2>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-tactile-mint/15 text-tactile-mint border border-tactile-mint/25">
          {MONAD_TESTNET.chainName}
        </span>
      </div>

      {walletConnected ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-tactile-mint/10 border border-tactile-mint/25">
            <span className="w-2.5 h-2.5 rounded-full bg-tactile-mint animate-pulse" />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-tactile-mint block">
                Connected via {walletType?.toUpperCase()}
              </span>
              <span className="text-xs font-mono text-text-secondary truncate block">
                {walletAddress}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
            >
              <Copy size={14} />
            </button>
          </div>

          {/* Live Balances Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <span className="text-[10px] text-text-muted block">MON Fuel</span>
              <p className="font-bold text-sm text-text-primary font-mono mt-0.5">
                {walletBalances.mon.toFixed(2)} MON
              </p>
            </div>
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <span className="text-[10px] text-text-muted block">Agora AUSD</span>
              <p className="font-bold text-sm text-brand-violet font-mono mt-0.5">
                ${walletBalances.ausd.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <span className="text-[10px] text-text-muted block">USDC</span>
              <p className="font-bold text-sm text-text-primary font-mono mt-0.5">
                ${walletBalances.usdc.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <span className="text-[10px] text-text-muted block">WETH</span>
              <p className="font-bold text-sm text-text-primary font-mono mt-0.5">
                {walletBalances.weth.toFixed(2)} ETH
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              onClick={requestFaucet}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold bg-brand-violet/15 hover:bg-brand-violet/25 text-brand-violet border border-brand-violet/30 transition-all cursor-pointer"
            >
              <Droplets size={14} /> Request Monad Testnet Faucet (+100 MON)
            </button>
            <button
              onClick={disconnectWallet}
              className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-negative bg-negative/10 hover:bg-negative/20 border border-negative/20 transition-all cursor-pointer"
            >
              <LogOut size={13} /> Disconnect
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 space-y-4">
          <p className="text-xs text-text-secondary">
            Connect your EVM wallet or sign in with Google/Twitter via Privy to access onchain Monad features.
          </p>
          <Button onClick={() => setIsWalletModalOpen(true)} className="mx-auto">
            <span>Connect Wallet</span>
          </Button>
        </div>
      )}
    </div>
  )
}

function EcosystemStatusSection() {
  return (
    <div className="tactile-glass rounded-2xl p-5 sm:p-6 border border-white/[0.08] shadow-tactile-card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-base text-text-primary font-display flex items-center gap-2">
          <Globe size={16} className="text-tactile-mint" />
          Metropolis Protocol Status
        </h2>
        <span className="text-[10px] font-mono text-text-muted">RPC: testnet-rpc.monad.xyz</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.entries(ECOSYSTEM_INTEGRATIONS).map(([key, item]) => (
          <div key={key} className="p-3.5 rounded-xl bg-black/25 border border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-primary font-display">
                {item.name}
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-tactile-mint/15 text-tactile-mint border border-tactile-mint/30">
                ● {item.status}
              </span>
            </div>
            <p className="text-[11px] text-text-muted">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const [reduceMotion, setReduceMotion] = useState(false)
  const {
    tradingMode,
    setTradingMode,
    addToast,
    theme,
    toggleTheme,
    level,
    setLevel,
    setIsEmailAuthModalOpen,
  } = useAppStore()

  const handleToggleSound = () => {
    setSoundEffects(!soundEffects)
    addToast(`Audio effects ${!soundEffects ? 'enabled' : 'muted'}`, 'info')
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-text-primary font-display">
          Settings & Network
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
          Configure wallet connections, trading arena preferences, and audio chimes.
        </p>
      </div>

      <WalletSection />

      {/* Preferences Section */}
      <div className="tactile-glass rounded-2xl p-5 sm:p-6 border border-white/[0.08] shadow-tactile-card space-y-4">
        <h2 className="font-bold text-base text-text-primary font-display flex items-center gap-2">
          <Sliders size={16} className="text-brand-violet" />
          Arena Experience Preferences
        </h2>

        <div className="divide-y divide-white/5 text-xs">
          <div className="flex items-center justify-between py-3">
            <div>
              <span className="font-semibold text-text-primary block">Arena Audio Effects</span>
              <span className="text-text-muted">Chimes on trade fill, XP gain, and level up</span>
            </div>
            <button
              onClick={handleToggleSound}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                soundEffects ? 'bg-tactile-mint' : 'bg-white/10'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  soundEffects ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Theme Switcher: Dark vs Light Effect */}
          <div className="flex items-center justify-between py-3">
            <div>
              <span className="font-semibold text-text-primary block">Website Theme Effect</span>
              <span className="text-text-muted">Switch between Deep Iris Dark Mode and Frosted Light Mode</span>
            </div>
            <div className="flex rounded-lg p-0.5 bg-black/40 border border-white/5">
              <button
                onClick={() => theme !== 'dark' && toggleTheme()}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-brand-violet text-white shadow-sm'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                <span>🌙</span> Dark
              </button>
              <button
                onClick={() => theme !== 'light' && toggleTheme()}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-brand-violet text-white shadow-sm'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                <span>☀️</span> Light
              </button>
            </div>
          </div>

          {/* Player Level Progression Tester (0 to 100) */}
          <div className="py-3 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-text-primary block">Player Level Calibration (0 - 100 MAX)</span>
                <span className="text-text-muted">Test new initiate experience (Lv. 0) or unlock endgame prestige (Lv. 100)</span>
              </div>
              <span className="font-bold text-sm font-mono text-brand-violet">
                Level {level} / 100
              </span>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {[
                { lvl: 0, label: '🌱 Lv.0 Initiate' },
                { lvl: 10, label: '⚡ Lv.10 Adept' },
                { lvl: 25, label: '🔥 Lv.25 Elite' },
                { lvl: 50, label: '💎 Lv.50 Master' },
                { lvl: 75, label: '🏆 Lv.75 Grandmaster' },
                { lvl: 100, label: '👑 Lv.100 Sovereign' },
              ].map(({ lvl, label }) => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    level === lvl
                      ? 'bg-brand-violet text-white shadow-pill-active'
                      : 'bg-white/5 text-text-secondary hover:bg-white/10'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <span className="font-semibold text-text-primary block">Active Trading Mode</span>
              <span className="text-text-muted">Toggle between $10K paper balance and Monad Live</span>
            </div>
            <div className="flex rounded-lg p-0.5 bg-black/40 border border-white/5">
              <button
                onClick={() => setTradingMode('demo')}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  tradingMode === 'demo'
                    ? 'bg-accent-amber/20 text-accent-amber border border-accent-amber/30'
                    : 'text-text-muted'
                }`}
              >
                Demo
              </button>
              <button
                onClick={() => setTradingMode('live')}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  tradingMode === 'live'
                    ? 'bg-brand-violet/20 text-brand-violet border border-brand-violet/30'
                    : 'text-text-muted'
                }`}
              >
                Monad Live
              </button>
            </div>
          </div>
        </div>
      </div>

      <EcosystemStatusSection />
    </div>
  )
}
