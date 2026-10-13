import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Coins,
  ShieldCheck,
  TrendingUp,
  ArrowRightLeft,
  Lock,
  Unlock,
  CheckCircle2,
  ExternalLink,
  Droplets,
  Sparkles,
  BarChart3,
  Percent,
  RefreshCw,
  Info,
  DollarSign,
  Landmark,
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { MONAD_TESTNET } from '../lib/web3/monadConfig'
import ClashDoodleMascot from '../components/ClashDoodleMascot'

export default function AgoraHub() {
  const {
    walletConnected,
    walletBalances,
    swapAgoraAUSD,
    redeemAgoraAUSD,
    stakeAgoraAUSD,
    unstakeAgoraAUSD,
    agoraStakedAmount,
    requestFaucet,
    addToast,
    setIsWalletModalOpen,
  } = useAppStore()

  const [activeTab, setActiveTab] = useState<'mint' | 'redeem' | 'vault'>('mint')
  const [mintFromToken, setMintFromToken] = useState<'MON' | 'USDC'>('MON')
  const [redeemToToken, setRedeemToToken] = useState<'MON' | 'USDC'>('USDC')
  const [mintInput, setMintInput] = useState('20')
  const [redeemInput, setRedeemInput] = useState('100')
  const [stakeInput, setStakeInput] = useState('250')
  const [unstakeInput, setUnstakeInput] = useState('100')

  // Live accumulating yield simulation (ticking every 2 seconds)
  const [liveYield, setLiveYield] = useState(1.428)
  useEffect(() => {
    if (agoraStakedAmount <= 0) return
    const interval = setInterval(() => {
      setLiveYield((prev) => prev + (agoraStakedAmount * 0.0525) / (365 * 24 * 3600) * 2)
    }, 2000)
    return () => clearInterval(interval)
  }, [agoraStakedAmount])

  // Conversion rates: 1 MON = $12.47 AUSD, 1 USDC = $1.0000 AUSD
  const monPrice = 12.47
  const mintNum = parseFloat(mintInput || '0')
  const estAusdReceive =
    mintFromToken === 'MON' ? mintNum * monPrice : mintNum

  const redeemNum = parseFloat(redeemInput || '0')
  const estRedeemReceive =
    redeemToToken === 'MON' ? redeemNum / monPrice : redeemNum

  const handleMint = () => {
    if (mintNum <= 0) {
      addToast('Please enter a valid amount to mint', 'error')
      return
    }
    swapAgoraAUSD(mintFromToken, mintNum)
  }

  const handleRedeem = () => {
    if (redeemNum <= 0) {
      addToast('Please enter a valid amount to redeem', 'error')
      return
    }
    redeemAgoraAUSD(redeemToToken, redeemNum)
  }

  const handleStake = () => {
    const num = parseFloat(stakeInput || '0')
    if (num <= 0) {
      addToast('Please enter an amount to stake', 'error')
      return
    }
    stakeAgoraAUSD(num)
  }

  const handleUnstake = () => {
    const num = parseFloat(unstakeInput || '0')
    if (num <= 0) {
      addToast('Please enter an amount to unstake', 'error')
      return
    }
    unstakeAgoraAUSD(num)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="tactile-glass rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-tactile-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-violet/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-violet/15 text-brand-violet border border-brand-violet/30 shadow-sm">
                <Coins size={13} /> Agora Finance
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-tactile-mint/15 text-tactile-mint border border-tactile-mint/30">
                <ShieldCheck size={13} /> Monad Native Institutional Stablecoin
              </span>
              <span className="text-xs font-mono text-text-muted">
                1:1 US Treasury Backed
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-text-primary font-display tracking-tight">
              Agora AUSD Protocol
            </h1>

            <p className="text-sm text-text-secondary leading-relaxed">
              AUSD is the premier institutional-grade, cash & short-term Treasury-backed stablecoin powering Monad’s high-throughput DeFi ecosystem. Mint, redeem, and earn risk-free yield with 400ms finality and 0% slippage.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-tactile-mint animate-pulse" />
                <span className="text-xs font-mono text-text-primary">
                  Peg: <strong>$1.0000 USD</strong> (0.00% dev)
                </span>
              </div>
              <div className="text-xs text-text-muted">
                Monad 400ms Oracle Latency
              </div>
              <div className="text-xs text-brand-violet font-semibold">
                100% Bankruptcy-Remote Trust
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-3">
            <ClashDoodleMascot size="md" mood="cheering" speechText="AUSD is 100% safe & liquid!" />
            <button
              onClick={requestFaucet}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-violet/15 hover:bg-brand-violet/25 text-brand-violet border border-brand-violet/30 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Droplets size={14} className="text-accent-sky" /> Claim +1,000 AUSD Faucet
            </button>
          </div>
        </div>
      </div>

      {/* Protocol Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="tactile-glass rounded-2xl p-4 border border-white/[0.08]">
          <span className="text-[11px] text-text-muted block">AUSD Circulating Supply</span>
          <p className="text-lg sm:text-xl font-black text-text-primary font-mono mt-1">
            $42,850,000
          </p>
          <span className="text-[10px] text-tactile-mint font-semibold">
            +$2.4M on Monad Testnet
          </span>
        </div>

        <div className="tactile-glass rounded-2xl p-4 border border-white/[0.08]">
          <span className="text-[11px] text-text-muted block">Total Reserve Backing</span>
          <p className="text-lg sm:text-xl font-black text-tactile-mint font-mono mt-1">
            $43,280,000
          </p>
          <span className="text-[10px] text-text-muted font-mono">
            101.0% Reserve Ratio (Audited)
          </span>
        </div>

        <div className="tactile-glass rounded-2xl p-4 border border-white/[0.08]">
          <span className="text-[11px] text-text-muted block">Treasury Yield (APY)</span>
          <p className="text-lg sm:text-xl font-black text-accent-amber font-mono mt-1">
            5.25% APY
          </p>
          <span className="text-[10px] text-text-muted">
            Daily Compounding in Vault
          </span>
        </div>

        <div className="tactile-glass rounded-2xl p-4 border border-white/[0.08]">
          <span className="text-[11px] text-text-muted block">Your AUSD Balance</span>
          <p className="text-lg sm:text-xl font-black text-brand-violet font-mono mt-1">
            ${walletBalances.ausd.toLocaleString()}
          </p>
          <span className="text-[10px] text-text-muted">
            {agoraStakedAmount > 0
              ? `+$${agoraStakedAmount.toLocaleString()} in Yield Vault`
              : 'Available for Trading & Staking'}
          </span>
        </div>
      </div>

      {/* Main Grid: Interactive Terminal & Reserve Attestation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Terminal (Mint / Redeem / Vault) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="tactile-glass rounded-3xl p-6 border border-white/[0.08] shadow-tactile-card">
            {/* Tabs */}
            <div className="flex rounded-2xl p-1 bg-black/40 border border-white/5 mb-6">
              <button
                onClick={() => setActiveTab('mint')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'mint'
                    ? 'bg-brand-violet text-white shadow-pill-active'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                <Coins size={14} /> Mint AUSD (0% Fee)
              </button>
              <button
                onClick={() => setActiveTab('redeem')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'redeem'
                    ? 'bg-brand-violet text-white shadow-pill-active'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                <ArrowRightLeft size={14} /> Redeem Collateral
              </button>
              <button
                onClick={() => setActiveTab('vault')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'vault'
                    ? 'bg-brand-violet text-white shadow-pill-active'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                <TrendingUp size={14} /> Yield Vault (5.25%)
              </button>
            </div>

            {/* TAB 1: MINT */}
            {activeTab === 'mint' && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-black/25 border border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary font-medium">You Deposit Collateral</span>
                    <span className="text-text-muted">
                      Balance:{' '}
                      <strong className="text-text-primary font-mono">
                        {mintFromToken === 'MON'
                          ? `${walletBalances.mon.toFixed(2)} MON`
                          : `$${walletBalances.usdc.toLocaleString()} USDC`}
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={mintInput}
                      onChange={(e) => setMintInput(e.target.value)}
                      placeholder="0.0"
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono font-bold text-text-primary focus:outline-none focus:border-brand-violet/50"
                    />
                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/50 border border-white/10">
                      <button
                        onClick={() => setMintFromToken('MON')}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          mintFromToken === 'MON'
                            ? 'bg-brand-violet/25 text-brand-violet border border-brand-violet/30'
                            : 'text-text-muted hover:text-text-secondary'
                        }`}
                      >
                        🟣 MON
                      </button>
                      <button
                        onClick={() => setMintFromToken('USDC')}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          mintFromToken === 'USDC'
                            ? 'bg-brand-violet/25 text-brand-violet border border-brand-violet/30'
                            : 'text-text-muted hover:text-text-secondary'
                        }`}
                      >
                        🔵 USDC
                      </button>
                    </div>
                  </div>

                  {/* Percentage chips */}
                  <div className="flex gap-2">
                    {[25, 50, 75, 100].map((pct) => (
                      <button
                        key={pct}
                        onClick={() => {
                          const maxBal =
                            mintFromToken === 'MON' ? walletBalances.mon : walletBalances.usdc
                          setMintInput(((maxBal * pct) / 100).toFixed(mintFromToken === 'MON' ? 2 : 0))
                        }}
                        className="flex-1 py-1 rounded-lg text-[10px] font-mono font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-text-muted hover:text-text-primary border border-white/5 transition-colors cursor-pointer"
                      >
                        {pct === 100 ? 'MAX' : `${pct}%`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conversion Summary Arrow */}
                <div className="flex items-center justify-center -my-2">
                  <div className="w-8 h-8 rounded-full bg-brand-violet/20 border border-brand-violet/30 flex items-center justify-center text-brand-violet shadow-sm">
                    ↓
                  </div>
                </div>

                {/* Receive Box */}
                <div className="p-4 rounded-2xl bg-brand-violet/10 border border-brand-violet/25 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-brand-violet font-semibold flex items-center gap-1.5">
                      <Coins size={14} /> You Receive Agora AUSD
                    </span>
                    <span className="text-[11px] text-tactile-mint font-semibold">
                      Deterministic 1:1 Parity
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono text-text-primary">
                      ${estAusdReceive.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-brand-violet/20 text-brand-violet text-xs font-black font-mono">
                      AUSD
                    </span>
                  </div>
                </div>

                {/* Execution Specs */}
                <div className="p-3 rounded-xl bg-black/20 border border-white/5 space-y-1.5 text-xs text-text-muted">
                  <div className="flex justify-between">
                    <span>Protocol Rate</span>
                    <span className="font-mono text-text-primary">
                      {mintFromToken === 'MON' ? `1 MON = $${monPrice} AUSD` : '1 USDC = 1.0000 AUSD'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Slippage Protection</span>
                    <span className="font-mono text-tactile-mint font-bold">0.00% (Guaranteed)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Network Settlement</span>
                    <span className="font-mono text-brand-violet">Monad Testnet (400ms finality)</span>
                  </div>
                </div>

                <button
                  onClick={handleMint}
                  className="w-full py-3.5 rounded-2xl bg-tactile-mint hover:bg-tactile-mint/90 text-white font-bold text-sm shadow-pill-mint flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles size={16} /> Mint Agora AUSD Now (+35 XP)
                </button>
              </div>
            )}

            {/* TAB 2: REDEEM */}
            {activeTab === 'redeem' && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-black/25 border border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary font-medium">You Burn Agora AUSD</span>
                    <span className="text-text-muted">
                      Available: <strong className="text-brand-violet font-mono">${walletBalances.ausd.toLocaleString()} AUSD</strong>
                    </span>
                  </div>

                  <input
                    type="number"
                    value={redeemInput}
                    onChange={(e) => setRedeemInput(e.target.value)}
                    placeholder="0.0"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono font-bold text-text-primary focus:outline-none focus:border-brand-violet/50"
                  />

                  <div className="flex gap-2">
                    {[25, 50, 75, 100].map((pct) => (
                      <button
                        key={pct}
                        onClick={() => {
                          setRedeemInput(((walletBalances.ausd * pct) / 100).toFixed(0))
                        }}
                        className="flex-1 py-1 rounded-lg text-[10px] font-mono font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-text-muted hover:text-text-primary border border-white/5 transition-colors cursor-pointer"
                      >
                        {pct === 100 ? 'MAX' : `${pct}%`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/25 border border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary font-medium">Receive Asset</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setRedeemToToken('USDC')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                          redeemToToken === 'USDC'
                            ? 'bg-brand-violet/25 text-brand-violet border border-brand-violet/30'
                            : 'text-text-muted'
                        }`}
                      >
                        USDC
                      </button>
                      <button
                        onClick={() => setRedeemToToken('MON')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                          redeemToToken === 'MON'
                            ? 'bg-brand-violet/25 text-brand-violet border border-brand-violet/30'
                            : 'text-text-muted'
                        }`}
                      >
                        MON
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono text-text-primary">
                      {estRedeemReceive.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 4,
                      })}
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-white/10 text-text-primary text-xs font-bold font-mono">
                      {redeemToToken}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleRedeem}
                  className="w-full py-3.5 rounded-2xl bg-brand-violet hover:bg-brand-violet/90 text-white font-bold text-sm shadow-pill-active flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <ArrowRightLeft size={16} /> Redeem {redeemToToken} (+30 XP)
                </button>
              </div>
            )}

            {/* TAB 3: YIELD VAULT */}
            {activeTab === 'vault' && (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-accent-amber/10 via-black/40 to-brand-violet/10 border border-accent-amber/25 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-accent-amber font-bold uppercase tracking-wider block">
                        Treasury Backed Yield
                      </span>
                      <h4 className="text-xl font-black text-text-primary font-display mt-0.5">
                        Agora AUSD Staking Vault
                      </h4>
                    </div>
                    <span className="text-2xl font-black text-accent-amber font-mono">
                      5.25% APY
                    </span>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed">
                    Earn the yield of underlying US Treasuries while keeping complete instant liquidity on Monad. No lockup periods or exit penalties.
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[10px] text-text-muted block">Your Staked AUSD</span>
                      <p className="font-bold text-base text-text-primary font-mono mt-0.5">
                        ${agoraStakedAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[10px] text-text-muted block">Live Accrued Yield</span>
                      <p className="font-bold text-base text-tactile-mint font-mono mt-0.5">
                        +${liveYield.toFixed(4)} AUSD
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Deposit */}
                  <div className="p-4 rounded-2xl bg-black/25 border border-white/5 space-y-3">
                    <span className="text-xs font-bold text-text-primary block">
                      Deposit to Earn Yield
                    </span>
                    <input
                      type="number"
                      value={stakeInput}
                      onChange={(e) => setStakeInput(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-brand-violet/50"
                      placeholder="Amount to stake"
                    />
                    <button
                      onClick={handleStake}
                      className="w-full py-2.5 rounded-xl bg-tactile-mint text-white text-xs font-bold shadow-pill-mint cursor-pointer transition-all"
                    >
                      Deposit AUSD (+40 XP)
                    </button>
                  </div>

                  {/* Withdraw */}
                  <div className="p-4 rounded-2xl bg-black/25 border border-white/5 space-y-3">
                    <span className="text-xs font-bold text-text-primary block">
                      Withdraw Staked AUSD
                    </span>
                    <input
                      type="number"
                      value={unstakeInput}
                      onChange={(e) => setUnstakeInput(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-brand-violet/50"
                      placeholder="Amount to unstake"
                    />
                    <button
                      onClick={handleUnstake}
                      disabled={agoraStakedAmount <= 0}
                      className="w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] disabled:opacity-40 text-text-primary text-xs font-bold border border-white/10 cursor-pointer transition-all"
                    >
                      Withdraw to Wallet
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Proof of Reserves & Attestation Card */}
        <div className="space-y-6">
          <div className="tactile-glass rounded-3xl p-6 border border-white/[0.08] shadow-tactile-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-text-primary font-display flex items-center gap-2">
                <Landmark size={16} className="text-brand-violet" /> Proof of Reserves
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-tactile-mint/15 text-tactile-mint border border-tactile-mint/30">
                100% Backed
              </span>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              Agora assets are held in segregated, bankruptcy-remote accounts managed by regulated custodian partners.
            </p>

            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between text-text-muted mb-1">
                  <span>US Short-Term T-Bills</span>
                  <span className="font-mono text-text-primary font-bold">82.4% ($35.6M)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-brand-violet rounded-full" style={{ width: '82.4%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-text-muted mb-1">
                  <span>Overnight Reverse Repos</span>
                  <span className="font-mono text-text-primary font-bold">15.1% ($6.5M)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-tactile-mint rounded-full" style={{ width: '15.1%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-text-muted mb-1">
                  <span>Cash Deposits (FDIC Insured)</span>
                  <span className="font-mono text-text-primary font-bold">2.5% ($1.1M)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-accent-amber rounded-full" style={{ width: '2.5%' }} />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 space-y-2 text-[11px] text-text-muted">
              <div className="flex items-center justify-between">
                <span>Independent Auditor</span>
                <span className="text-text-primary font-semibold">Tier-1 US CPA Firm</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Attestation Schedule</span>
                <span className="text-text-primary font-semibold">Monthly Published</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Jurisdiction</span>
                <span className="text-text-primary font-semibold">Delaware Trust Entity</span>
              </div>
            </div>
          </div>

          {/* Testnet Specs Box */}
          <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-2.5 text-xs">
            <span className="text-[11px] font-bold text-text-primary block flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-tactile-mint" /> Monad Testnet Token Details
            </span>
            <div className="space-y-1.5 font-mono text-[11px] text-text-secondary">
              <div className="flex justify-between">
                <span className="text-text-muted">Symbol:</span>
                <span className="text-text-primary font-bold">AUSD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Decimals:</span>
                <span className="text-text-primary">18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Chain ID:</span>
                <span className="text-text-primary">{MONAD_TESTNET.chainId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Bridge Latency:</span>
                <span className="text-tactile-mint font-semibold">400ms Sub-Second</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
