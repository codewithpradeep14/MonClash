import { create } from 'zustand'
import confetti from 'canvas-confetti'
import {
  MISSIONS,
  ACHIEVEMENTS,
  CURRENT_PLAYER,
  PORTFOLIO,
  POSITIONS,
  type Mission,
  type Position,
} from '../data/mockData'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'xp'
  xpAmount?: number
}

export type WalletType = 'zerion' | 'metamask' | 'rabby' | 'coinbase' | 'phantom' | 'privy'

interface AppState {
  // Navigation
  currentPage: string
  setCurrentPage: (page: string) => void

  // Theme (Dark / Light)
  theme: 'dark' | 'light'
  toggleTheme: () => void

  // Trading Mode
  tradingMode: 'demo' | 'live'
  setTradingMode: (mode: 'demo' | 'live') => void

  // Player Progression (Level 0 to Level 100 MAX)
  xp: number
  level: number
  xpToNext: number
  streak: number
  hasClaimedDailyStreak: boolean
  addXP: (amount: number) => void
  claimDailyStreak: () => void
  setLevel: (level: number) => void

  // Email User Authentication
  isEmailAuthModalOpen: boolean
  setIsEmailAuthModalOpen: (open: boolean) => void
  emailUser: { email: string; username: string } | null
  signInWithEmail: (email: string, username: string) => void

  // Balances & Agora Staking
  balance: number
  pnl: number
  walletBalances: {
    mon: number
    ausd: number
    usdc: number
    weth: number
  }
  agoraStakedAmount: number
  agoraAccumulatedYield: number
  stakeAgoraAUSD: (amount: number) => boolean
  unstakeAgoraAUSD: (amount: number) => boolean
  redeemAgoraAUSD: (toToken: 'MON' | 'USDC', amount: number) => boolean

  // Missions & Achievements
  missions: Mission[]
  completeMission: (id: string) => void
  achievements: typeof ACHIEVEMENTS
  unlockAchievement: (id: string) => void

  // Wallet & Privy Embedded State
  walletConnected: boolean
  walletAddress: string
  walletType: WalletType | null
  isWalletModalOpen: boolean
  setIsWalletModalOpen: (open: boolean) => void
  connectWallet: (type?: WalletType, customAddress?: string) => void
  disconnectWallet: () => void
  requestFaucet: () => void
  swapAgoraAUSD: (fromToken: 'MON' | 'USDC', amount: number) => boolean
  privyUser: { email?: string; provider?: string; passkey?: boolean } | null
  setPrivyUser: (user: { email?: string; provider?: string; passkey?: boolean } | null) => void
  sessionKeysEnabled: boolean
  toggleSessionKeys: () => void

  // Toasts
  toasts: Toast[]
  addToast: (message: string, type: Toast['type'], xpAmount?: number) => void
  removeToast: (id: string) => void

  // Trading State & Execution Engine
  positions: Position[]
  selectedMarket: string
  setSelectedMarket: (market: string) => void
  executeSpotOrder: (
    type: 'buy' | 'sell',
    pair: string,
    amount: number,
    price: number
  ) => boolean
  executePerpOrder: (
    direction: 'long' | 'short',
    pair: string,
    size: number,
    price: number,
    leverage: number
  ) => boolean
  closePosition: (id: string) => void

  // Competitions
  joinedCompetitions: string[]
  joinCompetition: (id: string) => void
  leaveCompetition: (id: string) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  currentPage: 'landing',
  setCurrentPage: (page) => set({ currentPage: page }),

  // Theme (Dark / Light)
  theme: typeof window !== 'undefined' && localStorage.getItem('monclash_theme') === 'light' ? 'light' : 'dark',
  toggleTheme: () => {
    const current = get().theme
    const next = current === 'dark' ? 'light' : 'dark'
    if (typeof document !== 'undefined') {
      if (next === 'light') {
        document.documentElement.classList.add('light')
      } else {
        document.documentElement.classList.remove('light')
      }
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('monclash_theme', next)
    }
    set({ theme: next })
    get().addToast(`Switched to ${next === 'light' ? 'Light' : 'Dark'} Mode`, 'info')
  },

  // Email User Authentication
  isEmailAuthModalOpen: false,
  setIsEmailAuthModalOpen: (open) => set({ isEmailAuthModalOpen: open }),
  emailUser: null,
  signInWithEmail: (email, username) => {
    const addr =
      '0x7702' +
      Array.from({ length: 36 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    set({
      emailUser: { email, username },
      walletConnected: true,
      walletAddress: addr,
      walletType: 'privy',
      isEmailAuthModalOpen: false,
      level: 0,
      xp: 0,
      xpToNext: 500,
    })
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#836EF9', '#10B981', '#38BDF8', '#FBBF24'],
      })
    } catch (e) {}
    get().addXP(100)
    get().addToast(`🎉 Welcome to MonClash, ${username}! Initiated at Level 0 with +100 XP Welcome Bonus!`, 'success')
  },

  tradingMode: 'demo',
  setTradingMode: (mode) => {
    set({ tradingMode: mode })
    get().addToast(
      mode === 'demo'
        ? 'Switched to Demo Arena ($10,000 Paper Balance)'
        : 'Switched to Monad Live Network Mode',
      'info'
    )
  },

  xp: CURRENT_PLAYER.xp,
  level: CURRENT_PLAYER.level,
  xpToNext: CURRENT_PLAYER.xpToNext,
  streak: 3,
  hasClaimedDailyStreak: false,

  setLevel: (newLevel) => {
    const clamped = Math.max(0, Math.min(newLevel, 100))
    const target = clamped === 0 ? 500 : Math.round(2000 * Math.pow(1.08, clamped))
    set({ level: clamped, xp: 0, xpToNext: target })
    get().addToast(`Player rank adjusted to Level ${clamped}!`, 'info')
  },

  addXP: (amount) => {
    const { xp, xpToNext, level } = get()
    const newXP = xp + amount

    if (level >= 100) {
      set({ xp: Math.min(newXP, xpToNext) })
      get().addToast(`⭐ Max Level 100 Prestige Honor: +${amount} XP!`, 'xp', amount)
      return
    }

    if (newXP >= xpToNext) {
      const overflow = newXP - xpToNext
      const newLevel = Math.min(100, level + 1)
      const nextTarget = Math.round(xpToNext * 1.15)
      set({ xp: overflow, level: newLevel, xpToNext: nextTarget })

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#836EF9', '#10B981', '#FBBF24', '#FFFFFF'],
        })
      } catch (e) {}

      get().addToast(
        newLevel >= 100
          ? '👑 MONAD SOVEREIGN: You reached MAX LEVEL 100!'
          : `🎉 LEVEL UP! You reached Level ${newLevel}!`,
        'xp',
        amount
      )
    } else {
      set({ xp: newXP })
    }
  },

  claimDailyStreak: () => {
    const { streak, hasClaimedDailyStreak, addXP, addToast } = get()
    if (hasClaimedDailyStreak) {
      addToast('Daily streak bonus already claimed today!', 'info')
      return
    }

    set({ streak: streak + 1, hasClaimedDailyStreak: true })
    addXP(150)

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#F59E0B', '#FBBF24', '#836EF9'],
      })
    } catch (e) {}

    addToast(`🔥 Day ${streak + 1} Streak Bonus Claimed! +150 XP`, 'xp', 150)
  },

  balance: PORTFOLIO.totalBalance,
  pnl: PORTFOLIO.totalPnL,
  walletBalances: {
    mon: 125.4,
    ausd: 3500.0,
    usdc: 1420.5,
    weth: 0.85,
  },

  missions: MISSIONS,
  completeMission: (id) => {
    const { missions, addXP, addToast } = get()
    const mission = missions.find((m) => m.id === id)
    if (!mission || mission.completed || mission.locked) return

    const updated = missions.map((m) =>
      m.id === id ? { ...m, completed: true, progress: m.target } : m
    )
    set({ missions: updated })
    addXP(mission.xpReward)

    try {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#836EF9', '#10B981', '#FFFFFF'],
      })
    } catch (e) {}

    addToast(
      `Mission completed: ${mission.title}! +${mission.xpReward} XP`,
      'xp',
      mission.xpReward
    )
  },

  achievements: ACHIEVEMENTS,
  unlockAchievement: (id) => {
    const { achievements, addXP, addToast } = get()
    const ach = achievements.find((a) => a.id === id)
    if (!ach || ach.unlocked) return

    const updated = achievements.map((a) =>
      a.id === id
        ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
        : a
    )
    set({ achievements: updated })
    addXP(ach.xpReward)

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#FBBF24', '#836EF9', '#38BDF8'],
      })
    } catch (e) {}

    addToast(
      `🏆 Achievement Unlocked: ${ach.title}! +${ach.xpReward} XP`,
      'xp',
      ach.xpReward
    )
  },

  // Wallet
  walletConnected: false,
  walletAddress: '',
  walletType: null,
  isWalletModalOpen: false,
  setIsWalletModalOpen: (open) => set({ isWalletModalOpen: open }),

  connectWallet: (type = 'metamask', customAddress) => {
    const addr =
      customAddress ||
      '0x' +
        Array.from({ length: 40 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join('')

    set({
      walletConnected: true,
      walletAddress: addr,
      walletType: type,
      isWalletModalOpen: false,
    })

    try {
      confetti({
        particleCount: 40,
        spread: 45,
        origin: { y: 0.8 },
        colors: ['#10B981', '#836EF9'],
      })
    } catch (e) {}

    get().addToast(`Connected with ${type.toUpperCase()}!`, 'success')
  },

  disconnectWallet: () => {
    set({
      walletConnected: false,
      walletAddress: '',
      walletType: null,
    })
    get().addToast('Wallet disconnected', 'info')
  },

  requestFaucet: () => {
    const { walletBalances, addToast, addXP } = get()
    set({
      walletBalances: {
        ...walletBalances,
        mon: walletBalances.mon + 100,
        ausd: walletBalances.ausd + 1000,
      },
    })

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#836EF9', '#10B981', '#38BDF8'],
      })
    } catch (e) {}

    addXP(50)
    addToast('🚰 Monad Faucet: Received +100 MON & +1,000 AUSD!', 'success')
  },

  // Agora Stablecoin Protocol State & Actions
  agoraStakedAmount: 0,
  agoraAccumulatedYield: 0,

  swapAgoraAUSD: (fromToken, amount) => {
    const { walletBalances, addToast, addXP } = get()
    if (fromToken === 'MON') {
      if (walletBalances.mon < amount) {
        addToast('Insufficient MON balance to mint AUSD', 'error')
        return false
      }
      set({
        walletBalances: {
          ...walletBalances,
          mon: walletBalances.mon - amount,
          ausd: walletBalances.ausd + amount * 12.47, // 1 MON = $12.47
        },
      })
    } else {
      if (walletBalances.usdc < amount) {
        addToast('Insufficient USDC balance to swap to AUSD', 'error')
        return false
      }
      set({
        walletBalances: {
          ...walletBalances,
          usdc: walletBalances.usdc - amount,
          ausd: walletBalances.ausd + amount, // 1 USDC = 1 AUSD (1:1 par)
        },
      })
    }

    try {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#10B981', '#836EF9'],
      })
    } catch (e) {}

    addXP(35)
    addToast(`Agora AUSD Minted: +${(fromToken === 'MON' ? amount * 12.47 : amount).toFixed(2)} AUSD!`, 'success')
    return true
  },

  redeemAgoraAUSD: (toToken, ausdAmount) => {
    const { walletBalances, addToast, addXP } = get()
    if (walletBalances.ausd < ausdAmount) {
      addToast('Insufficient AUSD balance to redeem', 'error')
      return false
    }

    if (toToken === 'MON') {
      const monReceived = ausdAmount / 12.47
      set({
        walletBalances: {
          ...walletBalances,
          ausd: walletBalances.ausd - ausdAmount,
          mon: walletBalances.mon + monReceived,
        },
      })
    } else {
      set({
        walletBalances: {
          ...walletBalances,
          ausd: walletBalances.ausd - ausdAmount,
          usdc: walletBalances.usdc + ausdAmount,
        },
      })
    }

    try {
      confetti({
        particleCount: 40,
        spread: 45,
        origin: { y: 0.7 },
        colors: ['#836EF9', '#FBBF24'],
      })
    } catch (e) {}

    addXP(30)
    addToast(`Redeemed $${ausdAmount.toLocaleString()} AUSD -> ${toToken} on Monad!`, 'success')
    return true
  },

  stakeAgoraAUSD: (amount) => {
    const { walletBalances, agoraStakedAmount, addToast, addXP } = get()
    if (walletBalances.ausd < amount) {
      addToast('Insufficient AUSD balance to stake into Agora Vault', 'error')
      return false
    }

    set({
      walletBalances: {
        ...walletBalances,
        ausd: walletBalances.ausd - amount,
      },
      agoraStakedAmount: agoraStakedAmount + amount,
    })

    try {
      confetti({
        particleCount: 45,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#10B981', '#FBBF24'],
      })
    } catch (e) {}

    addXP(40)
    addToast(`Deposited $${amount.toLocaleString()} AUSD to Agora 5.25% APY Vault!`, 'success')
    return true
  },

  unstakeAgoraAUSD: (amount) => {
    const { walletBalances, agoraStakedAmount, addToast } = get()
    if (agoraStakedAmount < amount) {
      addToast('Withdrawal exceeds currently staked AUSD amount', 'error')
      return false
    }

    set({
      agoraStakedAmount: agoraStakedAmount - amount,
      walletBalances: {
        ...walletBalances,
        ausd: walletBalances.ausd + amount,
      },
    })

    addToast(`Withdrew $${amount.toLocaleString()} AUSD from Agora Yield Vault`, 'info')
    return true
  },

  // Privy Embedded State
  privyUser: null,
  setPrivyUser: (user) => set({ privyUser: user }),
  sessionKeysEnabled: true,
  toggleSessionKeys: () => {
    const next = !get().sessionKeysEnabled
    set({ sessionKeysEnabled: next })
    get().addToast(
      next
        ? 'Privy Session Keys enabled: 1-Click gas-sponsored trades active!'
        : 'Privy Session Keys paused: Manual signing requested for each trade',
      'info'
    )
  },

  // Toasts
  toasts: [],
  addToast: (message, type, xpAmount) => {
    const id = Math.random().toString(36).slice(2)
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, xpAmount }],
    }))
    setTimeout(() => get().removeToast(id), 4000)
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  // Positions & Trading
  positions: POSITIONS,
  selectedMarket: 'MON/USDC',
  setSelectedMarket: (market) => set({ selectedMarket: market }),

  executeSpotOrder: (type, pair, amount, price) => {
    const totalCost = amount * price
    const { balance, addToast, addXP, missions } = get()

    if (type === 'buy' && totalCost > balance) {
      addToast('Insufficient balance for spot order', 'error')
      return false
    }

    const newBalance = type === 'buy' ? balance - totalCost : balance + totalCost
    set({ balance: Math.max(0, newBalance) })

    // Auto-advance trading missions
    const updatedMissions = missions.map((m) => {
      if (m.id === 'd1' && !m.completed) {
        const nextProg = m.progress + 1
        return {
          ...m,
          progress: nextProg,
          completed: nextProg >= m.target,
        }
      }
      return m
    })
    set({ missions: updatedMissions })

    addXP(25)
    addToast(
      `Kuru CLOB ${type.toUpperCase()} Filled: ${amount.toFixed(2)} ${pair} @ $${price.toFixed(2)}`,
      'success'
    )
    return true
  },

  executePerpOrder: (direction, pair, size, price, leverage) => {
    const margin = (size * price) / leverage
    const { balance, positions, addToast, addXP, missions } = get()

    if (margin > balance) {
      addToast('Insufficient margin available to open perp position', 'error')
      return false
    }

    const liqPrice =
      direction === 'long'
        ? price * (1 - (1 / leverage) * 0.9)
        : price * (1 + (1 / leverage) * 0.9)

    const newPos: Position = {
      id: 'pos_' + Date.now(),
      pair,
      type: direction,
      size,
      entryPrice: price,
      currentPrice: price,
      leverage,
      liquidationPrice: Math.max(0.01, liqPrice),
      pnl: 0,
      pnlPct: 0,
      margin,
      fundingRate: 0.0012,
    }

    set({
      positions: [newPos, ...positions],
      balance: Math.max(0, balance - margin),
    })

    // Advance perp missions
    const updatedMissions = missions.map((m) => {
      if (m.id === 'd2' && !m.completed) {
        const nextProg = m.progress + 1
        return {
          ...m,
          progress: nextProg,
          completed: nextProg >= m.target,
        }
      }
      return m
    })
    set({ missions: updatedMissions })

    addXP(40)
    addToast(
      `Perpl ${direction.toUpperCase()} Opened: ${size} ${pair} at ${leverage}x leverage`,
      'success'
    )
    return true
  },

  closePosition: (id) => {
    const { positions, balance, addToast, addXP } = get()
    const pos = positions.find((p) => p.id === id)
    if (!pos) return

    const returnAmount = pos.margin + pos.pnl
    set({
      positions: positions.filter((p) => p.id !== id),
      balance: Math.max(0, balance + returnAmount),
    })

    const isProfit = pos.pnl >= 0
    if (isProfit) addXP(50)

    addToast(
      `Position Closed: ${pos.pair} ${pos.type.toUpperCase()} • PnL: ${
        isProfit ? '+' : ''
      }$${pos.pnl.toFixed(2)}`,
      isProfit ? 'success' : 'info'
    )
  },

  // Competitions
  joinedCompetitions: ['c1'],
  joinCompetition: (id) => {
    const { joinedCompetitions, addToast, addXP } = get()
    if (joinedCompetitions.includes(id)) return
    set({ joinedCompetitions: [...joinedCompetitions, id] })
    addXP(75)
    addToast('Arena pass registered! Joined competition.', 'success')
  },
  leaveCompetition: (id) => {
    const { joinedCompetitions, addToast } = get()
    set({ joinedCompetitions: joinedCompetitions.filter((c) => c !== id) })
    addToast('Withdrew from competition.', 'info')
  },
}))
