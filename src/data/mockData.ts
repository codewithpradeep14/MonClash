// ─── MonClash Mock Data Layer ───────────────────────────────────────────────

export interface Market {
  symbol: string
  name: string
  price: number
  change24h: number
  volume: string
  high24h: number
  low24h: number
  marketCap: string
  logoColor: string
}

export interface Candle {
  time: number
  dateLabel: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface OrderBookEntry {
  price: number
  size: number
  total: number
}

export interface Player {
  id: string
  username: string
  avatar: string
  level: number
  xp: number
  xpToNext: number
  league: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Champion'
  rank: number
  pnl: number
  pnlPct: number
  trades: number
  winRate: number
  consistency: number
  riskScore: number
  streak: number
  isCurrentUser?: boolean
}

export interface Mission {
  id: string
  title: string
  description: string
  xpReward: number
  type: 'daily' | 'weekly' | 'seasonal'
  progress: number
  target: number
  completed: boolean
  locked: boolean
  category: 'trading' | 'learning' | 'social' | 'risk'
  icon: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  xpReward: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  category: string
  unlocked: boolean
  unlockedAt?: string
  icon: string
  progress?: number
  target?: number
}

export interface Competition {
  id: string
  title: string
  description: string
  type: 'spot' | 'perps' | 'mixed'
  status: 'active' | 'upcoming' | 'completed'
  participants: number
  maxParticipants: number
  startTime: string
  endTime: string
  prizePool: string
  entryRequirement: string
  rules: string[]
  joined: boolean
  standings?: { rank: number; player: string; pnl: number }[]
}

export interface Position {
  id: string
  pair: string
  type: 'long' | 'short'
  size: number
  entryPrice: number
  currentPrice: number
  leverage: number
  liquidationPrice: number
  pnl: number
  pnlPct: number
  margin: number
  fundingRate: number
}

// ─── Markets ────────────────────────────────────────────────────────────────

export const MARKETS: Market[] = [
  { symbol: 'MON/USDC', name: 'Monad', price: 12.47, change24h: 8.34, volume: '142.3M', high24h: 13.12, low24h: 11.28, marketCap: '1.24B', logoColor: '#9B7BFF' },
  { symbol: 'BTC/USDC', name: 'Bitcoin', price: 83420.50, change24h: 2.14, volume: '2.8B', high24h: 84100, low24h: 81200, marketCap: '1.62T', logoColor: '#F5B942' },
  { symbol: 'ETH/USDC', name: 'Ethereum', price: 3284.20, change24h: -1.23, volume: '890M', high24h: 3380, low24h: 3210, marketCap: '394B', logoColor: '#627EEA' },
  { symbol: 'SOL/USDC', name: 'Solana', price: 185.60, change24h: 4.78, volume: '560M', high24h: 192, low24h: 176, marketCap: '84B', logoColor: '#9945FF' },
  { symbol: 'ARB/USDC', name: 'Arbitrum', price: 1.124, change24h: -2.88, volume: '124M', high24h: 1.18, low24h: 1.08, marketCap: '3.2B', logoColor: '#12AAFF' },
  { symbol: 'OP/USDC', name: 'Optimism', price: 2.341, change24h: 1.65, volume: '98M', high24h: 2.44, low24h: 2.28, marketCap: '2.8B', logoColor: '#FF0420' },
  { symbol: 'LINK/USDC', name: 'Chainlink', price: 14.82, change24h: 3.22, volume: '210M', high24h: 15.4, low24h: 14.1, marketCap: '8.9B', logoColor: '#375BD2' },
  { symbol: 'AVAX/USDC', name: 'Avalanche', price: 38.94, change24h: -0.87, volume: '340M', high24h: 40.2, low24h: 38.1, marketCap: '16B', logoColor: '#E84142' },
]

// ─── Generate Candles ────────────────────────────────────────────────────────

export function generateCandles(
  basePrice: number,
  count: number = 60,
  timeframe: string = '15m',
  symbol: string = 'MON/USDC'
): Candle[] {
  const candles: Candle[] = []
  const now = Date.now()

  let interval = 15 * 60 * 1000
  let barCount = count
  let volatility = basePrice * 0.012
  let macroMultiplier = 0.92

  switch (timeframe) {
    case '1m':
      interval = 60 * 1000
      barCount = 60
      volatility = basePrice * 0.003
      macroMultiplier = 0.995
      break
    case '5m':
      interval = 5 * 60 * 1000
      barCount = 60
      volatility = basePrice * 0.007
      macroMultiplier = 0.985
      break
    case '15m':
      interval = 15 * 60 * 1000
      barCount = 60
      volatility = basePrice * 0.012
      macroMultiplier = 0.97
      break
    case '1h':
      interval = 60 * 60 * 1000
      barCount = 48
      volatility = basePrice * 0.024
      macroMultiplier = 0.93
      break
    case '4h':
      interval = 4 * 60 * 60 * 1000
      barCount = 42
      volatility = basePrice * 0.045
      macroMultiplier = 0.88
      break
    case '1D':
      interval = 24 * 60 * 60 * 1000
      barCount = 60
      volatility = basePrice * 0.075
      macroMultiplier = 0.76
      break
    case '1W':
      interval = 7 * 24 * 60 * 60 * 1000
      barCount = 52
      volatility = basePrice * 0.16
      macroMultiplier = 0.58
      break
    case '1M':
      interval = 30 * 24 * 60 * 60 * 1000
      barCount = 36
      volatility = basePrice * 0.32
      macroMultiplier = 0.35
      break
    case '1Y':
      interval = 365 * 24 * 60 * 60 * 1000
      barCount = 6
      volatility = basePrice * 0.65
      macroMultiplier = 0.18
      break
  }

  // Seed starting price according to historical timeframe depth
  let price = basePrice * macroMultiplier

  const formatDate = (timestamp: number): string => {
    const d = new Date(timestamp)
    if (timeframe === '1m' || timeframe === '5m' || timeframe === '15m') {
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
    if (timeframe === '1h' || timeframe === '4h') {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit' })
    }
    if (timeframe === '1D') {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
    if (timeframe === '1W' || timeframe === '1M') {
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    }
    return d.getFullYear().toString()
  }

  for (let i = barCount; i >= 0; i--) {
    const t = now - i * interval
    const wave1 = Math.sin((barCount - i) * 0.15) * volatility * 1.2
    const drift = ((barCount - i) / barCount) * (basePrice * (1 - macroMultiplier))
    const noise = (Math.random() - 0.48) * volatility

    const open = price
    let close = price + noise + (wave1 * 0.3)
    if (i === 0) {
      close = basePrice
    }

    const high = Math.max(open, close) + Math.random() * volatility * 0.4
    const low = Math.max(0.001, Math.min(open, close) - Math.random() * volatility * 0.4)
    const volume = basePrice * (100 + Math.random() * 400) * (timeframe === '1D' || timeframe === '1W' ? 20 : 1)

    candles.push({
      time: t,
      dateLabel: formatDate(t),
      open: +open.toFixed(basePrice < 10 ? 4 : 2),
      high: +high.toFixed(basePrice < 10 ? 4 : 2),
      low: +low.toFixed(basePrice < 10 ? 4 : 2),
      close: +close.toFixed(basePrice < 10 ? 4 : 2),
      volume: Math.round(volume),
    })

    price = close
  }

  return candles
}

// ─── Order Book ──────────────────────────────────────────────────────────────

export function generateOrderBook(basePrice: number): { asks: OrderBookEntry[]; bids: OrderBookEntry[] } {
  const asks: OrderBookEntry[] = []
  const bids: OrderBookEntry[] = []
  let askTotal = 0
  let bidTotal = 0

  for (let i = 0; i < 12; i++) {
    const askPrice = basePrice * (1 + (i + 1) * 0.0004 + Math.random() * 0.0002)
    const askSize = Math.random() * 2 + 0.1
    askTotal += askSize
    asks.push({ price: askPrice, size: askSize, total: askTotal })
  }

  for (let i = 0; i < 12; i++) {
    const bidPrice = basePrice * (1 - (i + 1) * 0.0004 - Math.random() * 0.0002)
    const bidSize = Math.random() * 2 + 0.1
    bidTotal += bidSize
    bids.push({ price: bidPrice, size: bidSize, total: bidTotal })
  }

  return { asks, bids }
}

// ─── Players ─────────────────────────────────────────────────────────────────

export const PLAYERS: Player[] = [
  { id: '1', username: 'CryptoArena', avatar: 'CA', level: 42, xp: 84200, xpToNext: 90000, league: 'Champion', rank: 1, pnl: 128400, pnlPct: 284, trades: 847, winRate: 68.2, consistency: 91, riskScore: 72, streak: 14 },
  { id: '2', username: 'VoidTrader', avatar: 'VT', level: 38, xp: 72100, xpToNext: 80000, league: 'Diamond', rank: 2, pnl: 89200, pnlPct: 198, trades: 621, winRate: 64.8, consistency: 87, riskScore: 68, streak: 7 },
  { id: '3', username: 'NeonWolf', avatar: 'NW', level: 35, xp: 64800, xpToNext: 70000, league: 'Diamond', rank: 3, pnl: 74100, pnlPct: 165, trades: 534, winRate: 62.1, consistency: 84, riskScore: 65, streak: 3 },
  { id: '4', username: 'QuantumEdge', avatar: 'QE', level: 31, xp: 58200, xpToNext: 60000, league: 'Platinum', rank: 4, pnl: 58700, pnlPct: 131, trades: 412, winRate: 60.5, consistency: 80, riskScore: 71, streak: 9 },
  { id: '5', username: 'PhoenixRise', avatar: 'PR', level: 28, xp: 51400, xpToNext: 55000, league: 'Platinum', rank: 5, pnl: 47300, pnlPct: 105, trades: 387, winRate: 58.9, consistency: 77, riskScore: 64, streak: 2 },
  { id: '6', username: 'MonadKing', avatar: 'MK', level: 24, xp: 44100, xpToNext: 48000, league: 'Gold', rank: 6, pnl: 38900, pnlPct: 86, trades: 298, winRate: 57.4, consistency: 74, riskScore: 69, streak: 5 },
  { id: '7', username: 'AlphaSeeker', avatar: 'AS', level: 22, xp: 39800, xpToNext: 44000, league: 'Gold', rank: 7, pnl: 31200, pnlPct: 69, trades: 256, winRate: 55.8, consistency: 71, riskScore: 66, streak: 1 },
  { id: '8', username: 'ShadowFox', avatar: 'SF', level: 19, xp: 34200, xpToNext: 38000, league: 'Silver', rank: 8, pnl: 24100, pnlPct: 54, trades: 198, winRate: 54.2, consistency: 68, riskScore: 62, streak: 4 },
  { id: '9', username: 'TradeHunter', avatar: 'TH', level: 17, xp: 29100, xpToNext: 32000, league: 'Silver', rank: 9, pnl: 18400, pnlPct: 41, trades: 167, winRate: 53.0, consistency: 65, riskScore: 70, streak: 0 },
  { id: 'me', username: 'You', avatar: 'YO', level: 15, xp: 24800, xpToNext: 28000, league: 'Silver', rank: 10, pnl: 14200, pnlPct: 32, trades: 142, winRate: 51.4, consistency: 62, riskScore: 67, streak: 3, isCurrentUser: true },
  { id: '11', username: 'PurpleStorm', avatar: 'PS', level: 12, xp: 19400, xpToNext: 22000, league: 'Bronze', rank: 11, pnl: 8700, pnlPct: 19, trades: 98, winRate: 49.8, consistency: 59, riskScore: 58, streak: 1 },
  { id: '12', username: 'DataDriven', avatar: 'DD', level: 10, xp: 15200, xpToNext: 18000, league: 'Bronze', rank: 12, pnl: 4200, pnlPct: 9, trades: 74, winRate: 48.1, consistency: 55, riskScore: 60, streak: 0 },
]

export const CURRENT_PLAYER = PLAYERS.find(p => p.isCurrentUser)!

// ─── Missions ────────────────────────────────────────────────────────────────

export const MISSIONS: Mission[] = [
  // Daily
  { id: 'd1', title: 'Market Explorer', description: 'Explore 3 different markets', xpReward: 50, type: 'daily', progress: 2, target: 3, completed: false, locked: false, category: 'trading', icon: '🔭' },
  { id: 'd2', title: 'First Blood', description: 'Complete your first simulated trade today', xpReward: 75, type: 'daily', progress: 0, target: 1, completed: false, locked: false, category: 'trading', icon: '⚔️' },
  { id: 'd3', title: 'Daily Analyst', description: 'Review your trading performance', xpReward: 40, type: 'daily', progress: 1, target: 1, completed: true, locked: false, category: 'learning', icon: '📊' },
  { id: 'd4', title: 'Streak Keeper', description: 'Maintain your login streak', xpReward: 30, type: 'daily', progress: 1, target: 1, completed: true, locked: false, category: 'social', icon: '🔥' },
  { id: 'd5', title: 'Risk Manager', description: 'Set stop-loss on 2 positions', xpReward: 60, type: 'daily', progress: 0, target: 2, completed: false, locked: false, category: 'risk', icon: '🛡️' },
  // Weekly
  { id: 'w1', title: 'Volume Master', description: 'Complete 20 simulated trades', xpReward: 300, type: 'weekly', progress: 14, target: 20, completed: false, locked: false, category: 'trading', icon: '📈' },
  { id: 'w2', title: 'Arena Warrior', description: 'Participate in 2 competitions', xpReward: 500, type: 'weekly', progress: 1, target: 2, completed: false, locked: false, category: 'social', icon: '🏆' },
  { id: 'w3', title: 'Diversifier', description: 'Trade 5 different pairs', xpReward: 250, type: 'weekly', progress: 5, target: 5, completed: true, locked: false, category: 'trading', icon: '🎯' },
  { id: 'w4', title: 'Learning Path', description: 'Complete 3 risk challenges', xpReward: 400, type: 'weekly', progress: 1, target: 3, completed: false, locked: false, category: 'risk', icon: '🎓' },
  { id: 'w5', title: 'Social Trader', description: 'Share your best trade result', xpReward: 150, type: 'weekly', progress: 0, target: 1, completed: false, locked: true, category: 'social', icon: '🌐' },
  // Seasonal
  { id: 's1', title: 'Season Champion', description: 'Reach top 100 on the global leaderboard', xpReward: 2000, type: 'seasonal', progress: 10, target: 100, completed: false, locked: false, category: 'trading', icon: '👑' },
  { id: 's2', title: 'Perp Pioneer', description: 'Open 50 perpetual positions', xpReward: 1500, type: 'seasonal', progress: 23, target: 50, completed: false, locked: false, category: 'trading', icon: '⚡' },
  { id: 's3', title: 'Streak Legend', description: 'Maintain a 30-day login streak', xpReward: 1000, type: 'seasonal', progress: 3, target: 30, completed: false, locked: false, category: 'social', icon: '💎' },
]

// ─── Achievements ────────────────────────────────────────────────────────────

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', title: 'First Trade', description: 'Complete your first simulated trade', xpReward: 100, rarity: 'common', category: 'Trading', unlocked: true, unlockedAt: '2024-10-01', icon: '⚔️' },
  { id: 'a2', title: 'Market Watcher', description: 'Add 5 assets to your watchlist', xpReward: 75, rarity: 'common', category: 'Trading', unlocked: true, unlockedAt: '2024-10-02', icon: '👁️' },
  { id: 'a3', title: 'Risk Aware', description: 'Set stop-loss on 10 positions', xpReward: 150, rarity: 'common', category: 'Risk', unlocked: true, unlockedAt: '2024-10-05', icon: '🛡️' },
  { id: 'a4', title: 'Hot Streak', description: 'Win 5 trades in a row', xpReward: 200, rarity: 'rare', category: 'Trading', unlocked: true, unlockedAt: '2024-10-08', icon: '🔥' },
  { id: 'a5', title: 'Arena Debut', description: 'Enter your first competition', xpReward: 250, rarity: 'rare', category: 'Competitions', unlocked: true, unlockedAt: '2024-10-10', icon: '🏟️' },
  { id: 'a6', title: 'Monad Native', description: 'Trade MON/USDC 20 times', xpReward: 300, rarity: 'rare', category: 'Trading', unlocked: false, icon: '🟣', progress: 14, target: 20 },
  { id: 'a7', title: 'Perp Master', description: 'Open 25 perpetual positions', xpReward: 400, rarity: 'rare', category: 'Perps', unlocked: false, icon: '⚡', progress: 12, target: 25 },
  { id: 'a8', title: 'Diamond Hands', description: 'Hold a position for 7+ days', xpReward: 500, rarity: 'epic', category: 'Trading', unlocked: false, icon: '💎', progress: 0, target: 1 },
  { id: 'a9', title: 'Century Club', description: 'Complete 100 simulated trades', xpReward: 600, rarity: 'epic', category: 'Trading', unlocked: false, icon: '💯', progress: 42, target: 100 },
  { id: 'a10', title: 'Top Performer', description: 'Reach top 10 on the leaderboard', xpReward: 800, rarity: 'epic', category: 'Leaderboard', unlocked: false, icon: '🎯', progress: 0, target: 1 },
  { id: 'a11', title: 'Consistency King', description: 'Maintain 70%+ win rate over 50 trades', xpReward: 1000, rarity: 'legendary', category: 'Trading', unlocked: false, icon: '👑', progress: 0, target: 1 },
  { id: 'a12', title: 'Season Legend', description: 'Win a seasonal competition', xpReward: 2000, rarity: 'legendary', category: 'Competitions', unlocked: false, icon: '🌟', progress: 0, target: 1 },
]

// ─── Competitions ─────────────────────────────────────────────────────────────

export const COMPETITIONS: Competition[] = [
  {
    id: 'c1',
    title: 'Weekly Spot Sprint',
    description: 'Compete for the highest PnL% in spot trading over 7 days. Pure skill, no leverage.',
    type: 'spot',
    status: 'active',
    participants: 247,
    maxParticipants: 500,
    startTime: '2024-10-07T00:00:00Z',
    endTime: '2024-10-14T00:00:00Z',
    prizePool: '5,000 XP',
    entryRequirement: 'Level 5+',
    rules: ['Max position size: 20% portfolio', 'No leverage', 'Simulated trades only', 'Top 10 win XP rewards'],
    joined: true,
    standings: [
      { rank: 1, player: 'CryptoArena', pnl: 18.4 },
      { rank: 2, player: 'VoidTrader', pnl: 15.2 },
      { rank: 3, player: 'NeonWolf', pnl: 12.8 },
      { rank: 47, player: 'You', pnl: 3.2 },
    ],
  },
  {
    id: 'c2',
    title: 'Perps Arena — Season 4 Finals',
    description: 'The ultimate perpetual trading competition. 50x leverage allowed. Top traders share the glory.',
    type: 'perps',
    status: 'active',
    participants: 189,
    maxParticipants: 200,
    startTime: '2024-10-01T00:00:00Z',
    endTime: '2024-10-31T00:00:00Z',
    prizePool: '20,000 XP',
    entryRequirement: 'Level 15+ / Platinum league',
    rules: ['Max leverage: 50x', 'Position size limit applies', 'Risk score tracked', 'Monthly leaderboard'],
    joined: false,
    standings: [],
  },
  {
    id: 'c3',
    title: 'Daily Flash — BTC/USDC',
    description: 'One-day BTC trading sprint. Fast, intense, high stakes. New competition every 24 hours.',
    type: 'spot',
    status: 'upcoming',
    participants: 0,
    maxParticipants: 100,
    startTime: '2024-10-14T08:00:00Z',
    endTime: '2024-10-15T08:00:00Z',
    prizePool: '2,000 XP',
    entryRequirement: 'Open to all',
    rules: ['BTC/USDC only', 'No leverage', 'Max 10 trades', 'Highest PnL% wins'],
    joined: false,
    standings: [],
  },
  {
    id: 'c4',
    title: 'MON Ecosystem Cup',
    description: 'Trade only Monad ecosystem tokens. Celebrate the Monad community through competitive trading.',
    type: 'mixed',
    status: 'upcoming',
    participants: 0,
    maxParticipants: 300,
    startTime: '2024-10-20T00:00:00Z',
    endTime: '2024-10-27T00:00:00Z',
    prizePool: '10,000 XP',
    entryRequirement: 'Level 10+',
    rules: ['MON ecosystem tokens only', 'Spot and Perps allowed', 'Leaderboard resets daily', 'Monad integration bonus'],
    joined: false,
    standings: [],
  },
  {
    id: 'c5',
    title: 'Season 3 — Grand Finals',
    description: 'The best traders from Season 3 competed for the ultimate title. History in the making.',
    type: 'mixed',
    status: 'completed',
    participants: 500,
    maxParticipants: 500,
    startTime: '2024-09-01T00:00:00Z',
    endTime: '2024-09-30T00:00:00Z',
    prizePool: '50,000 XP',
    entryRequirement: 'Top 500 from Season 3',
    rules: ['All pairs allowed', 'All order types', 'Risk-adjusted scoring'],
    joined: false,
    standings: [
      { rank: 1, player: 'CryptoArena', pnl: 342 },
      { rank: 2, player: 'VoidTrader', pnl: 287 },
      { rank: 3, player: 'NeonWolf', pnl: 241 },
    ],
  },
]

// ─── Positions ────────────────────────────────────────────────────────────────

export const POSITIONS: Position[] = [
  {
    id: 'p1',
    pair: 'BTC-PERP',
    type: 'long',
    size: 0.15,
    entryPrice: 81200,
    currentPrice: 83420,
    leverage: 5,
    liquidationPrice: 64960,
    pnl: 333,
    pnlPct: 2.73,
    margin: 2436,
    fundingRate: 0.0102,
  },
  {
    id: 'p2',
    pair: 'ETH-PERP',
    type: 'short',
    size: 1.2,
    entryPrice: 3380,
    currentPrice: 3284,
    leverage: 3,
    liquidationPrice: 4387,
    pnl: 115.2,
    pnlPct: 2.84,
    margin: 1352,
    fundingRate: -0.0045,
  },
]

// ─── Portfolio ────────────────────────────────────────────────────────────────

export const PORTFOLIO = {
  totalBalance: 24842.50,
  availableBalance: 18124.80,
  marginUsed: 3788.20,
  totalPnL: 14200,
  totalPnLPct: 32.4,
  todayPnL: 847.30,
  todayPnLPct: 3.52,
  weekPnL: 2140.80,
  weekPnLPct: 8.97,
  monthPnL: 4820.10,
  monthPnLPct: 24.1,
}

// ─── Recent Trades ────────────────────────────────────────────────────────────

export const RECENT_TRADES = [
  { id: 't1', pair: 'MON/USDC', side: 'buy', price: 12.24, size: 150, time: '2m ago', pnl: 34.5, pnlPct: 1.88 },
  { id: 't2', pair: 'BTC/USDC', side: 'sell', price: 83100, size: 0.02, time: '18m ago', pnl: -12.4, pnlPct: -0.72 },
  { id: 't3', pair: 'ETH/USDC', side: 'buy', price: 3240, size: 0.5, time: '1h ago', pnl: 22.1, pnlPct: 1.36 },
  { id: 't4', pair: 'SOL/USDC', side: 'buy', price: 179.20, size: 5, time: '3h ago', pnl: 32.0, pnlPct: 3.57 },
  { id: 't5', pair: 'MON/USDC', side: 'sell', price: 11.88, size: 200, time: '5h ago', pnl: 48.0, pnlPct: 2.02 },
]

// ─── Performance Chart Data ───────────────────────────────────────────────────

export function generatePerformanceData(days: number = 30) {
  const data = []
  let equity = 10000
  const now = new Date()
  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const change = (Math.random() - 0.42) * 600
    equity = Math.max(equity + change, 8000)
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      equity: Math.round(equity),
      pnl: Math.round(change),
    })
  }
  return data
}

// ─── League Config ────────────────────────────────────────────────────────────

export const LEAGUE_CONFIG = {
  Bronze: { color: '#CD7F32', bg: 'rgba(205,127,50,0.15)', border: 'rgba(205,127,50,0.3)', icon: '🥉' },
  Silver: { color: '#C0C0C0', bg: 'rgba(192,192,192,0.15)', border: 'rgba(192,192,192,0.3)', icon: '🥈' },
  Gold: { color: '#F5B942', bg: 'rgba(245,185,66,0.15)', border: 'rgba(245,185,66,0.3)', icon: '🥇' },
  Platinum: { color: '#35D49A', bg: 'rgba(53,212,154,0.15)', border: 'rgba(53,212,154,0.3)', icon: '💠' },
  Diamond: { color: '#9B7BFF', bg: 'rgba(155,123,255,0.15)', border: 'rgba(155,123,255,0.3)', icon: '💎' },
  Champion: { color: '#FF647C', bg: 'rgba(255,100,124,0.15)', border: 'rgba(255,100,124,0.3)', icon: '👑' },
}
