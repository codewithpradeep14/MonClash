# MonClash — Full-Stack Web3 Gamified Trading Platform

> **Trade. Compete. Conquer.**  
> *One arena. Two trading styles. One player identity.*  
> Engineered natively for the **Monad** high-throughput parallel EVM ecosystem.

---

## 1. Overview & Vision

**MonClash** is a competitive Web3 trading arena combining low-latency trading experiences with an esports-grade gamification engine. It unites two distinct trading disciplines:
- **Spot Arena:** Powered by **Kuru** onchain Central Limit Order Book (CLOB).
- **Perps Arena:** Powered by **Perpl** high-frequency perpetuals engine.

Player progression rewards **consistency, win rate, and risk discipline** (Sharpe-ratio based ranking) rather than reckless leverage or raw lottery volume.

---

## 2. Design System & Aesthetics (Human-Crafted & Tactile)

Inspired by tactile fintech interfaces (e.g. *Maltea* organic frosted pill indicators) and playful arcade characters (minimalist robot line doodles & retro Tokyo gaming badges):
- **Bespoke Color Palette:**
  - Deep obsidian velvet canvas (`#0A0B12`) with frosted graphite surfaces (`#111320`)
  - Authentic Monad Electric Iris & Amethyst (`#836EF9`, `#6D55E0`)
  - Tactile Sage & Mint (`#10B981`, `#34D399`) for positive returns and safety
  - Coral Ember (`#FF4D6D`) for risk indicators & short positions
  - Champion Amber & Gold (`#FBBF24`, `#F59E0B`) for leagues, badges, and streaks
- **Animated MonBot Mascot (`ClashDoodleMascot.tsx`):**
  - Minimalist line-art robot companion with pulsing radio antenna, animated blinking/star LED matrix eyes, waving joints, and plasma hover propulsion.
  - Interactive reactions to user actions: cheers on trade fills and level-ups, sweats on high leverage (>20x), and shares real market insights when clicked.
- **Floating Live Status Pills (`LiveTactilePills.tsx`):**
  - Sub-second Monad block finality (400ms blocks, 800ms finality).
  - Kuru CLOB 0ms pending-state fills.
  - Perpl dynamic margin defense.
  - Agora AUSD $28.4M stable pool depth.
  - 3-Day Winning Streak (+150 XP bonus).

---

## 3. Verified Ecosystem Integrations

| Protocol / Network | Role | Official Chain / Specs | Status | Features |
|---|---|---|---|---|
| **Monad Network** | Layer-1 Blockchain | Chain ID: `10143` (Testnet) / `20143` (Devnet) | **Connected / Ready** | 10,000 TPS, 400ms block slot, 800ms finality, sub-cent gas fees |
| **Kuru DEX** | Spot Trading | Fully onchain CLOB | **Connected** | Sub-millisecond matching, zero pending state, 0.02% taker fee |
| **Perpl Exchange** | Perpetuals | High-frequency perps engine | **Connected** | Up to 50x leverage, cross-margin risk guard, 8h funding rates |
| **Agora Finance (AUSD)** | Native Stablecoin | Monad native digital dollar | **Ready** | 1:1 USD reserves, zero spread settlement, stability pool |

---

## 4. Key Application Pages & Features

1. **Landing Page (`/`):**
   - Editorial headline *"Trade. Compete. Conquer."* with human-crafted typography.
   - Interactive hero with **playable mini-terminal** (click *Quick Spot* or *Quick Perp* to test instant execution).
   - Live tactile status pills and animated MonBot mascot.
   - Core arena previews, league ladders, and verified ecosystem links.

2. **Main Dashboard (`/overview`):**
   - Player identity, level progression bar, and league badge.
   - 3-day winning streak calendar with interactive claim button (+150 XP).
   - Real-time portfolio valuation, PnL, available margin, and Agora AUSD reserves.
   - 30-day equity curve chart with timeframe switcher.
   - Quick launch cards for Spot and Perps arenas.

3. **Spot Arena (`/spot`):**
   - Market selector with search (MON/USDC, BTC/USDC, ETH/USDC, etc.).
   - Interactive candlestick chart (1m, 5m, 15m, 1h, 4h, 1D).
   - Kuru CLOB live depth orderbook with dynamic spread indicator.
   - Spot order terminal (Market & Limit, 25%/50%/75%/100% sizing) with real balance deductions and quest progress triggers.

4. **Perps Arena (`/perps`):**
   - Long (Bull) and Short (Bear) controls.
   - Tactile leverage slider (1x up to 50x) with real-time liquidation price math.
   - Dynamic risk meter (Healthy Guard, Moderate, Degenerate / High Risk).
   - MonBot sweating/warning animation when leverage exceeds 20x.
   - Active positions table with real-time PnL and one-click Close Position management.

5. **Missions & Quests (`/missions`):**
   - Daily, Weekly, and Seasonal trading quests.
   - Real-time progress tracking tied to order placement.
   - Claim button with audio-visual confetti burst (`canvas-confetti`).
   - Anti-duplicate claim enforcement.

6. **Leaderboard & Leagues (`/leaderboard`):**
   - 3D-styled Champions Podium with arcade medals (🥇, 🥈, 🥉).
   - League tier filters (Bronze, Silver, Gold, Platinum, Diamond, Champion).
   - Transparent scoring weighted by consistency, win rate, and Sharpe ratio.

7. **Competitions & Tournaments (`/competitions`):**
   - Scheduled sprint events (Weekly Spot Sprint, Daily Flash BTC, etc.).
   - Live countdown clocks and participant fill meters.
   - Join/Withdraw flows with arena registration pass (+75 XP).

8. **Player Profile (`/profile`):**
   - Player card with customizable MonBot companion.
   - 6-axis Radar Chart: Consistency, Risk Management, Win Rate, Volume, Streak, and Diversity.
   - Seasonal career placement records.

9. **Badges & Achievements (`/achievements`):**
   - Tiered badges (Common, Rare, Epic, Legendary).
   - Modal with unlock and claim XP rewards.

10. **Web3 Settings & Wallet Modal (`/settings`):**
    - Connect with MetaMask, Rabby, Coinbase Wallet, Phantom, or Privy Social Login.
    - Testnet Faucet: Request +100 MON & +1,000 AUSD.
    - EIP-4361 Sign-In-With-Monad (SIWE) signature verification.
    - Active trading mode toggle (Demo $10,000 paper funds vs Monad Live mode).

---

## 5. Getting Started & Running Locally

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
```bash
# Clone and enter workspace
cd MonClash

# Install dependencies
npm install
```

### Running Development Server
```bash
npm run dev
```
Open [http://localhost:5174/](http://localhost:5174/) in your browser.

### Running Test Suite
```bash
npm test
```
Executes all 9 automated unit & integration test suites verifying:
- Monad Testnet configuration & protocol truthfulness
- XP calculations & level scaling
- Mission completion & anti-duplicate reward prevention
- Daily streak discipline mechanics
- Kuru Spot order execution & capital deduction
- Perpl leverage & liquidation math
- Monad & Agora AUSD faucet operations
- Tournament arena registration flows
- Web3 wallet connect & disconnect states

### Building for Production
```bash
npm run build
```
Creates an optimized, minified production bundle in `dist/`.

---

## 6. Architecture & Code Structure

```
MonClash/
├── index.html                       # HTML5 entrypoint with Google Fonts
├── src/
│   ├── components/
│   │   ├── ClashDoodleMascot.tsx    # Animated SVG MonBot mascot & expressions
│   │   ├── LiveTactilePills.tsx     # Tactile floating live status pills
│   │   ├── DoodleDecorations.tsx    # Playful hand-drawn arcade doodle accents
│   │   ├── WalletModal.tsx          # Web3 Connect Wallet & Faucet modal
│   │   ├── Sidebar.tsx              # Application shell navigation & player pill
│   │   └── ui.tsx                   # Tactile buttons, cards, XP bars, badges
│   ├── pages/
│   │   ├── Landing.tsx              # Editorial hero, playable mini-terminal, features
│   │   ├── Dashboard.tsx            # Arena terminal overview & daily streak bonus
│   │   ├── SpotArena.tsx            # Kuru CLOB orderbook & spot execution
│   │   ├── PerpsArena.tsx           # Perpl leverage terminal & position management
│   │   ├── Missions.tsx             # Quests engine & calendar streak
│   │   ├── Leaderboard.tsx          # Podium & risk-adjusted rankings
│   │   ├── Competitions.tsx         # Tournaments & registration
│   │   ├── Profile.tsx              # Radar discipline chart & career records
│   │   ├── Achievements.tsx         # Rarity badges & unlock flows
│   │   └── Settings.tsx             # Monad testnet status & preferences
│   ├── store/
│   │   └── useAppStore.ts           # State store with trading execution engine
│   ├── lib/
│   │   └── web3/
│   │       └── monadConfig.ts       # Monad Testnet & ecosystem protocol specs
│   ├── data/
│   │   └── mockData.ts              # Market candles, orderbooks, players, quests
│   ├── tests/
│   │   ├── monclash.test.ts         # Automated test suite (9 test categories)
│   │   └── run.ts                   # Test runner entrypoint
│   ├── index.css                    # Design system tokens & tactile glass styling
│   └── main.tsx                     # React root
└── tailwind.config.js               # Monad brand tokens & custom animations
```
