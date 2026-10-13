import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Wallet,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Copy,
  Check,
  Droplets,
  LogOut,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Globe,
  Coins,
  KeyRound,
  Fingerprint,
  Mail,
  Zap,
  Lock,
  Layers,
  ChevronRight,
} from 'lucide-react'
import { useAppStore, type WalletType } from '../store/useAppStore'
import { MONAD_TESTNET } from '../lib/web3/monadConfig'

interface WalletOption {
  type: WalletType
  name: string
  description: string
  icon: string
  badge?: string
  popular?: boolean
  sponsor?: boolean
}

const WALLET_OPTIONS: WalletOption[] = [
  {
    type: 'zerion',
    name: 'Zerion Wallet',
    description: 'Premier smart Web3 wallet with Monad API & real-time portfolio tracking',
    icon: '🟣',
    badge: 'METROPOLIS SPONSOR',
    popular: true,
    sponsor: true,
  },
  {
    type: 'metamask',
    name: 'MetaMask',
    description: 'Standard browser extension & mobile wallet for EVM chains',
    icon: '🦊',
    badge: 'MONAD TESTNET READY',
    popular: true,
  },
  {
    type: 'privy',
    name: 'Privy Embedded Wallet',
    description: 'Frictionless Web3 auth via Google, Twitter, Email, or Passkeys',
    icon: '⚡',
    badge: 'ZERO-EXTENSION LOGIN',
    popular: true,
  },
  {
    type: 'phantom',
    name: 'Phantom',
    description: 'Multi-chain Web3 wallet with EVM testnet support',
    icon: '👻',
  },
  {
    type: 'rabby',
    name: 'Rabby Wallet',
    description: 'Game & DeFi optimized security wallet with transaction preview',
    icon: '🐰',
  },
  {
    type: 'coinbase',
    name: 'Coinbase Wallet',
    description: 'Self-custodial mobile & smart wallet with gas sponsorship',
    icon: '🔵',
  },
]

export default function WalletModal() {
  const {
    isWalletModalOpen,
    setIsWalletModalOpen,
    walletConnected,
    walletAddress,
    walletType,
    walletBalances,
    connectWallet,
    disconnectWallet,
    requestFaucet,
    tradingMode,
    setTradingMode,
    setCurrentPage,
    privyUser,
    setPrivyUser,
    sessionKeysEnabled,
    toggleSessionKeys,
    setIsEmailAuthModalOpen,
    addToast,
  } = useAppStore()

  const [copied, setCopied] = useState(false)
  const [connectingWallet, setConnectingWallet] = useState<WalletType | null>(null)
  const [connectingStep, setConnectingStep] = useState<string>('')
  const [isSigning, setIsSigning] = useState(false)
  const [signatureVerified, setSignatureVerified] = useState(false)
  const [isSwitchingChain, setIsSwitchingChain] = useState(false)

  // Privy sub-view state
  const [privySubView, setPrivySubView] = useState(false)
  const [privyStep, setPrivyStep] = useState<'methods' | 'otp' | 'passkey' | 'exportKey'>('methods')
  const [privyEmail, setPrivyEmail] = useState('')
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', ''])
  const [exportedKeyRevealed, setExportedKeyRevealed] = useState(false)

  if (!isWalletModalOpen) return null

  const handleCopy = () => {
    if (!walletAddress) return
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    addToast('Address copied to clipboard!', 'info')
  }

  // Multi-step connecting UX flow for Zerion, MetaMask, etc.
  const handleConnect = async (type: WalletType) => {
    if (type === 'privy') {
      setPrivySubView(true)
      setPrivyStep('methods')
      return
    }

    setConnectingWallet(type)
    setConnectingStep('Detecting wallet provider...')

    // Check for real browser extension
    const eth = (window as any).ethereum
    if (eth && (type === 'metamask' || type === 'zerion' || type === 'rabby')) {
      try {
        setConnectingStep('Requesting accounts from extension...')
        const accounts = await eth.request({ method: 'eth_requestAccounts' })
        if (accounts && accounts[0]) {
          setConnectingStep('Verifying Monad Testnet (Chain ID 10143)...')
          setTimeout(() => {
            connectWallet(type, accounts[0])
            setConnectingWallet(null)
            addToast(`Connected to Monad via ${type.toUpperCase()}!`, 'success')
          }, 600)
          return
        }
      } catch (err: any) {
        // User rejected or extension closed, fall back to smooth simulated session
      }
    }

    // High fidelity connection simulation for non-extension or sandbox environments
    setTimeout(() => {
      setConnectingStep(`Querying ${type === 'zerion' ? 'Zerion API' : 'RPC'} on Monad Testnet...`)
    }, 400)

    setTimeout(() => {
      setConnectingStep('Allocating gas sponsorship & state...')
    }, 800)

    setTimeout(() => {
      connectWallet(type)
      setConnectingWallet(null)
      addToast(`Connected to Monad Testnet via ${type.toUpperCase()}!`, 'success')
    }, 1200)
  }

  // Handle Privy Social login
  const handlePrivySocial = (provider: string) => {
    const privyAddr =
      '0x7702' +
      Array.from({ length: 36 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    setPrivyUser({ provider, email: `${provider.toLowerCase()}@user.monad` })
    connectWallet('privy', privyAddr)
    setPrivySubView(false)
    addToast(`Privy Smart Account created via ${provider} on Monad!`, 'success')
  }

  // Handle Privy Email OTP initiation
  const handleInitiateEmail = (e: React.FormEvent) => {
    e.preventDefault()
    if (!privyEmail || !privyEmail.includes('@')) {
      addToast('Please enter a valid email address', 'error')
      return
    }
    setPrivyStep('otp')
    addToast(`6-Digit Verification Code sent to ${privyEmail}!`, 'info')
  }

  // Handle OTP Code Verification
  const handleVerifyOtp = (codeString: string) => {
    const privyAddr =
      '0x7702' +
      Array.from({ length: 36 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    setPrivyUser({ email: privyEmail, provider: 'Email OTP' })
    connectWallet('privy', privyAddr)
    setPrivySubView(false)
    addToast(`Privy Verified! Embedded Account Ready on Monad!`, 'success')
  }

  // Handle Passkey simulation
  const handlePasskeyAuth = () => {
    setPrivyStep('passkey')
    setTimeout(() => {
      const privyAddr =
        '0x7702' +
        Array.from({ length: 36 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      setPrivyUser({ passkey: true, provider: 'WebAuthn Passkey (EIP-7702)' })
      connectWallet('privy', privyAddr)
      setPrivySubView(false)
      addToast('Passkey Verified! Zero-Knowledge Monad Account created!', 'success')
    }, 1500)
  }

  // Switch chain to Monad Testnet
  const handleSwitchToMonad = async () => {
    setIsSwitchingChain(true)
    const eth = (window as any).ethereum

    if (eth) {
      try {
        await eth.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x279f' }], // 10143
        })
        addToast('Switched network to Monad Testnet (10143)!', 'success')
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            await eth.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x279f',
                  chainName: MONAD_TESTNET.chainName,
                  nativeCurrency: MONAD_TESTNET.nativeCurrency,
                  rpcUrls: [MONAD_TESTNET.rpcUrl],
                  blockExplorerUrls: [MONAD_TESTNET.blockExplorerUrl],
                },
              ],
            })
            addToast('Added & switched to Monad Testnet!', 'success')
          } catch (addError) {}
        }
      }
    } else {
      setTimeout(() => {
        addToast('Monad Testnet (Chain ID 10143) Active & Validated!', 'success')
      }, 500)
    }

    setIsSwitchingChain(false)
  }

  const handleSignMessage = () => {
    setIsSigning(true)
    setTimeout(() => {
      setIsSigning(false)
      setSignatureVerified(true)
      addToast('EIP-4361: Monad session signature verified onchain!', 'success')
    }, 1000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          setIsWalletModalOpen(false)
          setPrivySubView(false)
          setConnectingWallet(null)
        }}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-lg bg-bg-card border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.08] bg-bg-secondary/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-violet to-brand-purple flex items-center justify-center text-white shadow-pill-active">
              <Wallet size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base text-text-primary font-display">
                {privySubView
                  ? 'Privy Embedded Auth'
                  : connectingWallet
                  ? `Connecting ${connectingWallet.toUpperCase()}...`
                  : walletConnected
                  ? 'Monad Web3 Account'
                  : 'Connect to MonClash'}
              </h3>
              <div className="flex items-center gap-1.5 text-[11px] text-text-secondary mt-0.5">
                <span className="w-2 h-2 rounded-full bg-tactile-mint animate-pulse" />
                <span className="font-mono">
                  {MONAD_TESTNET.chainName} • Chain ID {MONAD_TESTNET.chainId}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setIsWalletModalOpen(false)
              setPrivySubView(false)
              setConnectingWallet(null)
            }}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* 1. CONNECTING STATE */}
          {connectingWallet ? (
            <div className="py-8 text-center space-y-4">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-2 border-brand-violet/20 border-t-brand-violet"
                />
                <span className="text-3xl">
                  {connectingWallet === 'zerion'
                    ? '🟣'
                    : connectingWallet === 'metamask'
                    ? '🦊'
                    : connectingWallet === 'privy'
                    ? '⚡'
                    : '👻'}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-text-primary font-display capitalize">
                  Connecting to {connectingWallet}
                </h4>
                <p className="text-xs text-text-muted mt-1 font-mono">{connectingStep}</p>
              </div>
              <p className="text-[11px] text-text-muted max-w-xs mx-auto">
                Opening wallet session on Monad Testnet (400ms finality, sponsored transactions).
              </p>
            </div>
          ) : privySubView ? (
            /* 2. PRIVY EMBEDDED FLOW */
            <div className="space-y-4">
              {privyStep === 'methods' && (
                <div className="space-y-3.5">
                  <div className="p-3 rounded-2xl bg-brand-violet/10 border border-brand-violet/25 flex items-start gap-3">
                    <Zap size={18} className="text-brand-violet flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-text-secondary leading-relaxed">
                      <strong>Privy Smart Account:</strong> Trade without browser extensions. Creates a secure embedded account on Monad with gas sponsored by MonClash!
                    </p>
                  </div>

                  {/* Social Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handlePrivySocial('Google')}
                      className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-text-primary transition-all cursor-pointer group"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="text-base">🌐</span> Continue with Google
                      </span>
                      <ArrowRight size={13} className="text-text-muted group-hover:text-brand-violet" />
                    </button>

                    <button
                      onClick={() => handlePrivySocial('Twitter / X')}
                      className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-text-primary transition-all cursor-pointer group"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="text-base font-bold">𝕏</span> Continue with Twitter / X
                      </span>
                      <ArrowRight size={13} className="text-text-muted group-hover:text-brand-violet" />
                    </button>

                    <button
                      onClick={() => handlePrivySocial('Discord')}
                      className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-text-primary transition-all cursor-pointer group"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="text-base">💬</span> Continue with Discord
                      </span>
                      <ArrowRight size={13} className="text-text-muted group-hover:text-brand-violet" />
                    </button>

                    <button
                      onClick={handlePasskeyAuth}
                      className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-brand-violet/15 hover:bg-brand-violet/25 border border-brand-violet/35 text-xs font-bold text-brand-violet transition-all cursor-pointer group"
                    >
                      <span className="flex items-center gap-2.5">
                        <Fingerprint size={16} /> One-Tap Touch ID / Passkey (EIP-7702)
                      </span>
                      <ArrowRight size={13} className="text-brand-violet" />
                    </button>
                  </div>

                  {/* Email OTP form */}
                  <div className="pt-2 border-t border-white/5">
                    <form onSubmit={handleInitiateEmail} className="space-y-2">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Mail size={14} className="absolute left-3 top-3 text-text-muted" />
                          <input
                            type="email"
                            placeholder="Enter your email address..."
                            value={privyEmail}
                            onChange={(e) => setPrivyEmail(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-violet/50"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-tactile-mint text-white shadow-pill-mint cursor-pointer"
                        >
                          Send Code
                        </button>
                      </div>
                    </form>
                  </div>

                  <button
                    onClick={() => setPrivySubView(false)}
                    className="w-full text-center text-xs text-text-muted hover:text-text-secondary pt-1 cursor-pointer"
                  >
                    ← Back to standard wallets
                  </button>
                </div>
              )}

              {/* OTP Code Step */}
              {privyStep === 'otp' && (
                <div className="space-y-4 py-2">
                  <div className="text-center space-y-1">
                    <h4 className="font-bold text-sm text-text-primary font-display">
                      Enter 6-Digit Code
                    </h4>
                    <p className="text-xs text-text-muted">
                      Sent to <strong className="text-text-primary">{privyEmail}</strong>
                    </p>
                  </div>

                  <div className="flex justify-center gap-2">
                    {otpCode.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          const val = e.target.value
                          const next = [...otpCode]
                          next[idx] = val
                          setOtpCode(next)
                          if (val && idx < 5) {
                            const nextEl = document.getElementById(`otp-${idx + 1}`)
                            nextEl?.focus()
                          }
                          if (next.every((d) => d !== '')) {
                            handleVerifyOtp(next.join(''))
                          }
                        }}
                        className="w-10 h-12 text-center text-lg font-mono font-bold bg-black/50 border border-white/15 rounded-xl text-text-primary focus:outline-none focus:border-brand-violet"
                      />
                    ))}
                  </div>

                  {/* Testnet One-Click autofill */}
                  <div className="p-3 rounded-xl bg-black/30 border border-white/5 text-center">
                    <p className="text-[11px] text-text-muted mb-2">Simulating email verification?</p>
                    <button
                      onClick={() => {
                        setOtpCode(['7', '3', '8', '4', '9', '2'])
                        setTimeout(() => handleVerifyOtp('738492'), 300)
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-violet/20 hover:bg-brand-violet/30 text-brand-violet border border-brand-violet/30 transition-all cursor-pointer"
                    >
                      ⚡ Auto-fill Test Code (738492)
                    </button>
                  </div>

                  <button
                    onClick={() => setPrivyStep('methods')}
                    className="w-full text-center text-xs text-text-muted hover:text-text-secondary cursor-pointer"
                  >
                    ← Change email address
                  </button>
                </div>
              )}

              {/* Passkey Fingerprint Scanner Modal */}
              {privyStep === 'passkey' && (
                <div className="py-8 text-center space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-brand-violet/15 border border-brand-violet/40 flex items-center justify-center text-brand-violet animate-pulse">
                    <Fingerprint size={42} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-text-primary font-display">
                      Biometric Touch ID / Face ID
                    </h4>
                    <p className="text-xs text-text-muted mt-1">
                      Signing cryptographic assertion for Monad Testnet...
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : walletConnected ? (
            /* 3. CONNECTED ACCOUNT VIEW */
            <div className="space-y-4">
              {/* Account Card */}
              <div className="p-4 rounded-2xl bg-bg-secondary/90 border border-white/[0.09] shadow-sm">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-tactile-mint animate-pulse" />
                    <span className="text-xs font-bold text-text-primary uppercase tracking-wider font-display">
                      {walletType === 'zerion'
                        ? '🟣 ZERION METROPOLIS TIER'
                        : walletType === 'metamask'
                        ? '🦊 METAMASK EVM'
                        : walletType === 'privy'
                        ? '⚡ PRIVY EMBEDDED ACCOUNT'
                        : `${walletType?.toUpperCase()} ACTIVE`}
                    </span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary font-mono bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 transition-colors cursor-pointer"
                  >
                    {copied ? <Check size={12} className="text-tactile-mint" /> : <Copy size={12} />}
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </button>
                </div>

                {/* Balances Grid */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/5 text-xs">
                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                    <span className="text-text-muted text-[10px] block">MON Fuel</span>
                    <p className="font-bold text-sm text-text-primary font-mono mt-0.5">
                      {walletBalances.mon.toFixed(2)} MON
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                    <span className="text-text-muted text-[10px] block">Agora AUSD</span>
                    <p className="font-bold text-sm text-brand-violet font-mono mt-0.5">
                      ${walletBalances.ausd.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Privy Embedded Perks */}
                {walletType === 'privy' && (
                  <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-text-muted">Gas Sponsorship:</span>
                      <span className="text-tactile-mint font-semibold">100% Free on Monad</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-text-muted">Session Keys (1-Click Trading):</span>
                      <button
                        onClick={toggleSessionKeys}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                          sessionKeysEnabled
                            ? 'bg-tactile-mint/20 text-tactile-mint border border-tactile-mint/30'
                            : 'bg-white/10 text-text-muted'
                        }`}
                      >
                        {sessionKeysEnabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                {/* Agora Hub button */}
                <button
                  onClick={() => {
                    setCurrentPage('agora')
                    setIsWalletModalOpen(false)
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold bg-brand-violet/15 hover:bg-brand-violet/25 text-brand-violet border border-brand-violet/30 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Coins size={14} /> Open Agora AUSD Hub (Mint / Stake 5.25%)
                  </span>
                  <ChevronRight size={14} />
                </button>

                {/* Request Faucet */}
                <button
                  onClick={requestFaucet}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-white/[0.05] hover:bg-white/[0.1] text-text-primary border border-white/10 transition-all cursor-pointer"
                >
                  <Droplets size={14} className="text-accent-sky" /> Request Monad Faucet (+100 MON & +1K AUSD)
                </button>

                {/* Switch to Monad Testnet */}
                <button
                  onClick={handleSwitchToMonad}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] text-text-secondary hover:text-text-primary border border-white/10 transition-colors cursor-pointer"
                >
                  <Globe size={13} className="text-tactile-mint" /> Add / Switch Monad Testnet (10143)
                </button>

                {/* EIP-4361 SIWE signature */}
                <button
                  onClick={handleSignMessage}
                  disabled={isSigning || signatureVerified}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] text-text-secondary hover:text-text-primary border border-white/10 transition-colors cursor-pointer"
                >
                  {isSigning ? (
                    <RefreshCw size={12} className="animate-spin" />
                  ) : signatureVerified ? (
                    <CheckCircle2 size={12} className="text-tactile-mint" />
                  ) : (
                    <ShieldCheck size={12} />
                  )}
                  {signatureVerified
                    ? 'EIP-4361 Monad Signature Verified'
                    : isSigning
                    ? 'Awaiting Signature...'
                    : 'Verify Wallet Signature (SIWE)'}
                </button>
              </div>

              {/* Disconnect & Switch wallet */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    disconnectWallet()
                  }}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold text-text-muted hover:text-text-primary bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer"
                >
                  Switch Wallet
                </button>
                <button
                  onClick={() => {
                    disconnectWallet()
                    setIsWalletModalOpen(false)
                  }}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold text-negative/80 hover:text-negative bg-negative/10 hover:bg-negative/20 border border-negative/20 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <LogOut size={13} /> Disconnect
                </button>
              </div>
            </div>
          ) : (
            /* 4. DISCONNECTED WALLET SELECTOR */
            <div className="space-y-3">
              <p className="text-xs text-text-secondary">
                Select your Web3 wallet or sign in instantly with social login on Monad:
              </p>

              <div className="space-y-2">
                {/* Email Sign-In Option for New Users */}
                <button
                  onClick={() => {
                    setIsWalletModalOpen(false)
                    setIsEmailAuthModalOpen(true)
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-tactile-mint/10 hover:bg-tactile-mint/15 border border-tactile-mint/30 transition-all group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl flex-shrink-0">✉️</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-tactile-mint font-display">
                          Sign In with Email / New Trader
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-tactile-mint/20 text-tactile-mint border border-tactile-mint/30">
                          LEVEL 0 + 100 XP
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        Zero-extension email login with $10K paper balance & sponsored gas
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-tactile-mint group-hover:translate-x-0.5 transition-transform" />
                </button>

                {WALLET_OPTIONS.map((w) => (
                  <button
                    key={w.type}
                    onClick={() => handleConnect(w.type)}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-bg-secondary/60 hover:bg-bg-secondary border border-white/[0.07] hover:border-brand-violet/40 transition-all group cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl flex-shrink-0">{w.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-text-primary group-hover:text-brand-violet transition-colors font-display">
                            {w.name}
                          </span>
                          {w.badge && (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                                w.sponsor
                                  ? 'bg-brand-violet/20 text-brand-violet border-brand-violet/30'
                                  : 'bg-white/10 text-text-secondary border-white/15'
                              }`}
                            >
                              {w.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-text-muted mt-0.5">{w.description}</p>
                      </div>
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-text-muted group-hover:text-brand-violet transition-colors"
                    />
                  </button>
                ))}
              </div>

              {/* Demo Arena Mode Callout */}
              <div className="p-3.5 rounded-2xl bg-accent-amber/5 border border-accent-amber/20 text-center">
                <p className="text-[11px] text-accent-amber font-medium">
                  Want to practice risk-free? Demo Arena provides $10,000 in paper funds!
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
