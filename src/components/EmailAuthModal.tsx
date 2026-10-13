import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  KeyRound,
  User,
  Sparkles,
  X,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

const AVATARS = ['YO', 'MK', 'AS', 'NW', 'VT', 'CA', '⚡', '🤖']

export default function EmailAuthModal() {
  const {
    isEmailAuthModalOpen,
    setIsEmailAuthModalOpen,
    signInWithEmail,
    addToast,
  } = useAppStore()

  const [mode, setMode] = useState<'signup' | 'signin'>('signup')
  const [step, setStep] = useState<'input' | 'otp'>('input')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState('YO')
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])

  if (!isEmailAuthModalOpen) return null

  const handleStartAuth = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address', 'error')
      return
    }
    if (mode === 'signup' && !username.trim()) {
      addToast('Please choose a trader username', 'error')
      return
    }

    setStep('otp')
    addToast(`Verification code sent to ${email}`, 'info')
  }

  const handleCompleteAuth = () => {
    const finalUsername = username.trim() || email.split('@')[0]
    signInWithEmail(email, finalUsername)
  }

  const handleAutoFillCode = () => {
    setOtpDigits(['9', '4', '8', '2', '1', '0'])
    setTimeout(() => {
      handleCompleteAuth()
    }, 400)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsEmailAuthModalOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-md bg-bg-card border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.08] bg-bg-secondary/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-tactile-mint to-brand-violet flex items-center justify-center text-white shadow-pill-mint">
              <Mail size={18} />
            </div>
            <div>
              <h3 className="font-bold text-base text-text-primary font-display">
                {step === 'otp'
                  ? 'Verify Your Email'
                  : mode === 'signup'
                  ? 'New Trader Registration'
                  : 'Sign In to MonClash'}
              </h3>
              <p className="text-[11px] text-text-secondary mt-0.5">
                Gas-Sponsored Monad Smart Account
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEmailAuthModalOpen(false)}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {step === 'input' ? (
            <>
              {/* Mode Toggle */}
              <div className="flex rounded-xl p-1 bg-black/40 border border-white/5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-tactile-mint text-white shadow-pill-mint'
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  Create Account (Level 0)
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                    mode === 'signin'
                      ? 'bg-brand-violet text-white shadow-pill-active'
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  Sign In
                </button>
              </div>

              <form onSubmit={handleStartAuth} className="space-y-3.5">
                {mode === 'signup' && (
                  <div>
                    <label className="text-xs font-semibold text-text-secondary block mb-1">
                      Choose Trader Handle
                    </label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-3 text-text-muted" />
                      <input
                        type="text"
                        placeholder="e.g. MonadClasher"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-tactile-mint/50"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-3 text-text-muted" />
                    <input
                      type="email"
                      placeholder="you@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-tactile-mint/50"
                    />
                  </div>
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="text-xs font-semibold text-text-secondary block mb-1.5">
                      Select Avatar Crest
                    </label>
                    <div className="flex gap-2">
                      {AVATARS.map((av) => (
                        <button
                          key={av}
                          type="button"
                          onClick={() => setSelectedAvatar(av)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black transition-all cursor-pointer ${
                            selectedAvatar === av
                              ? 'bg-brand-violet text-white ring-2 ring-brand-violet/50 scale-105'
                              : 'bg-white/5 text-text-secondary hover:bg-white/10'
                          }`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Level 0 Starter Perks */}
                <div className="p-3 rounded-2xl bg-tactile-mint/10 border border-tactile-mint/20 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-tactile-mint">
                    <Sparkles size={13} />
                    <span>New Trader Starting Package:</span>
                  </div>
                  <ul className="text-[11px] text-text-secondary space-y-0.5 list-disc list-inside">
                    <li>Begins at <strong>Level 0 (Unranked Initiate)</strong></li>
                    <li><strong>+100 XP</strong> Welcome Bonus on verification</li>
                    <li><strong>$10,000 Paper Funds</strong> in Demo Arena</li>
                    <li>100% Free sponsored gas on Monad Testnet</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-tactile-mint hover:bg-tactile-mint/90 text-white font-bold text-xs shadow-pill-mint flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Continue with Email</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            </>
          ) : (
            /* OTP Verification Screen */
            <div className="space-y-4 py-2">
              <div className="text-center space-y-1">
                <p className="text-xs text-text-muted">
                  Enter the 6-digit confirmation code sent to:
                </p>
                <p className="font-bold text-sm text-text-primary font-mono">{email}</p>
              </div>

              <div className="flex justify-center gap-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`auth-otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value
                      const next = [...otpDigits]
                      next[idx] = val
                      setOtpDigits(next)
                      if (val && idx < 5) {
                        const nextEl = document.getElementById(`auth-otp-${idx + 1}`)
                        nextEl?.focus()
                      }
                      if (next.every((d) => d !== '')) {
                        handleCompleteAuth()
                      }
                    }}
                    className="w-10 h-12 text-center text-lg font-mono font-bold bg-black/50 border border-white/15 rounded-xl text-text-primary focus:outline-none focus:border-tactile-mint"
                  />
                ))}
              </div>

              {/* Showcase 1-Click Verification */}
              <div className="p-3 rounded-xl bg-black/30 border border-white/5 text-center">
                <p className="text-[11px] text-text-muted mb-2">Simulating email for showcase?</p>
                <button
                  type="button"
                  onClick={handleAutoFillCode}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-brand-violet/20 hover:bg-brand-violet/30 text-brand-violet border border-brand-violet/30 transition-all cursor-pointer"
                >
                  ⚡ Auto-Verify Code (948210)
                </button>
              </div>

              <button
                type="button"
                onClick={() => setStep('input')}
                className="w-full text-center text-xs text-text-muted hover:text-text-secondary cursor-pointer"
              >
                ← Back to email input
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
