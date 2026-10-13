// ─── MonClash Level Progression System (Level 0 to Level 100 MAX) ──────────

export interface LevelTier {
  minLevel: number
  maxLevel: number
  title: string
  badge: string
  color: string
  perk: string
}

export const MAX_PLAYER_LEVEL = 100

export const LEVEL_TIERS: LevelTier[] = [
  {
    minLevel: 0,
    maxLevel: 0,
    title: 'Unranked Initiate',
    badge: '🌱',
    color: '#94A3B8',
    perk: 'Access to Demo Arena & Monad Testnet Faucet',
  },
  {
    minLevel: 1,
    maxLevel: 9,
    title: 'Novice Scalper',
    badge: '⚔️',
    color: '#10B981',
    perk: '1x-5x Leverage Unlocked, Daily Missions Active',
  },
  {
    minLevel: 10,
    maxLevel: 24,
    title: 'Adept Arbitrageur',
    badge: '⚡',
    color: '#38BDF8',
    perk: '10x Leverage, Agora Vault Staking, Tournaments Access',
  },
  {
    minLevel: 25,
    maxLevel: 49,
    title: 'Elite Orderflow Trader',
    badge: '🔥',
    color: '#836EF9',
    perk: '25x Leverage, Advanced Risk-Adjusted Analytics, 1-Click Session Keys',
  },
  {
    minLevel: 50,
    maxLevel: 74,
    title: 'Master of Volatility',
    badge: '💎',
    color: '#F59E0B',
    perk: '50x Max Leverage, Priority Kuru Orderbook Routing, Clan Battles',
  },
  {
    minLevel: 75,
    maxLevel: 99,
    title: 'Grandmaster Conqueror',
    badge: '🏆',
    color: '#FF4D6D',
    perk: 'Zero-fee Gas Sponsorship, Global Tournament Invitations, Gold Avatar Aura',
  },
  {
    minLevel: 100,
    maxLevel: 100,
    title: 'Monad Sovereign (MAX LEVEL)',
    badge: '👑',
    color: '#FBBF24',
    perk: 'Prestige Throne, Infinite Honor Badge, Custom Doodle Mascot Crown',
  },
]

export function getLevelTier(level: number): LevelTier {
  const safeLevel = Math.max(0, Math.min(level, MAX_PLAYER_LEVEL))
  const tier = LEVEL_TIERS.find((t) => safeLevel >= t.minLevel && safeLevel <= t.maxLevel)
  return tier || LEVEL_TIERS[LEVEL_TIERS.length - 1]
}

export function getLevelTitle(level: number): string {
  return getLevelTier(level).title
}

export function getXPThresholdForLevel(level: number): number {
  if (level === 0) return 500
  if (level >= MAX_PLAYER_LEVEL) return 1000000
  // Progressive exponential leveling curve
  return Math.round(500 * Math.pow(1.10, level))
}

export function isMaxLevel(level: number): boolean {
  return level >= MAX_PLAYER_LEVEL
}
