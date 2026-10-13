import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  X,
  ShieldCheck,
  Activity,
  Flame,
  Info,
  Sliders,
  Clock,
  Layers,
  ChevronDown,
  Share2,
  CheckCircle2,
  Sparkles,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, Badge, DemoBadge, Button } from '../components/ui'
import { useAppStore } from '../store/useAppStore'
import { MARKETS, generateCandles } from '../data/mockData'
import ClashDoodleMascot from '../components/ClashDoodleMascot'

const PERP_MARKETS = MARKETS.filter((m) =>
  ['MON/USDC', 'BTC/USDC', 'ETH/USDC', 'SOL/USDC'].includes(m.symbol)
).map((m) => ({
  ...m,
  symbol: m.symbol.replace('/USDC', '-PERP'),
}))

// Live Trades stream generator
interface RecentTrade {
  id: string
  price: number
  size: number
  side: 'buy' | 'sell'
  time: string
}

function SharePnLModal({
  position,
  onClose,
}: {
  position: any
  onClose: () => void
}) {
  const isProfit = position.pnl >= 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-sm bg-gradient-to-b from-bg-card to-bg-secondary border border-brand-violet/40 rounded-3xl p-6 shadow-2xl z-10 text-center space-y-4"
      >
        <div className="flex justify-between items-center text-xs text-text-muted">
          <span className="font-bold text-brand-violet font-display uppercase tracking-wider">
            MonClash • Perpl Engine
          </span>
          <button onClick={onClose} className="p-1 hover:text-white cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <div className="py-2">
          <ClashDoodleMascot size="md" mood={isProfit ? 'cheering' : 'idle'} showSpeech={false} />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold text-text-secondary uppercase">
            {position.pair} {position.type.toUpperCase()} @ {position.leverage}x
          </span>
          <div
            className={`text-4xl font-black font-display ${
              isProfit ? 'text-tactile-mint' : 'text-negative'
            }`}
          >
            {isProfit ? '+' : ''}
            {position.pnlPct.toFixed(2)}%
          </div>
          <p className="text-sm font-mono text-text-primary">
            {isProfit ? '+' : ''}${position.pnl.toFixed(2)} USD
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-left font-mono">
          <div>
            <span className="text-text-muted text-[10px] block">Entry Price</span>
            <p className="text-text-primary font-bold">${position.entryPrice.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-text-muted text-[10px] block">Margin</span>
            <p className="text-text-primary font-bold">${position.margin.toLocaleString()}</p>
          </div>
        </div>

        <button
          onClick={() => {
            navigator.clipboard.writeText(
              `Just locked in ${isProfit ? '+' : ''}${position.pnlPct.toFixed(2)}% on ${position.pair} with MonClash on Monad Testnet! 🚀⚡`
            )
            onClose()
          }}
          className="w-full py-2.5 rounded-xl bg-brand-violet hover:bg-brand-violet/90 text-white font-bold text-xs shadow-pill-active flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Share2 size={13} /> Copy Trade Win Card
        </button>
      </motion.div>
    </div>
  )
}

function PositionRow({ position }: { position: any }) {
  const { closePosition, addToast } = useAppStore()
  const [showShare, setShowShare] = useState(false)
  const isProfit = position.pnl >= 0
  const isLong = position.type === 'long'

  return (
    <>
      <div className="p-4 rounded-xl bg-bg-secondary/70 border border-white/5 hover:border-white/10 transition-all">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-text-primary font-display">
              {position.pair}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                isLong
                  ? 'bg-tactile-mint/15 text-tactile-mint border-tactile-mint/30'
                  : 'bg-negative/15 text-negative border-negative/30'
              }`}
            >
              {position.type}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-violet/15 text-brand-violet border border-brand-violet/30">
              {position.leverage}x
            </span>
          </div>

          <div className={`text-right ${isProfit ? 'text-tactile-mint' : 'text-negative'}`}>
            <span className="text-base font-black font-display">
              {isProfit ? '+' : ''}${position.pnl.toFixed(2)}
            </span>
            <span className="text-xs font-mono ml-2">
              ({isProfit ? '+' : ''}{position.pnlPct.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-3 p-2.5 rounded-lg bg-black/20 text-text-muted">
          <div>
            <span>Size</span>
            <p className="font-bold text-text-primary font-mono mt-0.5">
              {position.size}
            </p>
          </div>
          <div>
            <span>Entry Price</span>
            <p className="font-bold text-text-primary font-mono mt-0.5">
              ${position.entryPrice.toLocaleString()}
            </p>
          </div>
          <div>
            <span>Margin</span>
            <p className="font-bold text-text-primary font-mono mt-0.5">
              ${position.margin.toLocaleString()}
            </p>
          </div>
          <div>
            <span className="text-negative font-medium flex items-center gap-1">
              <AlertTriangle size={11} /> Est. Liq Price
            </span>
            <p className="font-bold text-negative font-mono mt-0.5">
              ${position.liquidationPrice.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-text-muted">
            Perpl Oracle Settlement: <strong className="text-tactile-mint">Instant (400ms)</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowShare(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-text-secondary hover:text-text-primary border border-white/5 transition-all cursor-pointer"
            >
              <Share2 size={12} /> Share
            </button>
            <button
              onClick={() => {
                closePosition(position.id)
                addToast(`Position ${position.pair} closed with PnL booked!`, 'info')
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-negative/10 hover:bg-negative/20 text-negative border border-negative/20 transition-all cursor-pointer"
            >
              <X size={12} /> Close Position
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showShare && <SharePnLModal position={position} onClose={() => setShowShare(false)} />}
      </AnimatePresence>
    </>
  )
}

function TradePanel({ market }: { market: (typeof PERP_MARKETS)[0] }) {
  const [direction, setDirection] = useState<'long' | 'short'>('long')
  const [marginMode, setMarginMode] = useState<'cross' | 'isolated'>('cross')
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market')
  const [limitPrice, setLimitPrice] = useState(market.price.toString())
  const [leverage, setLeverage] = useState(5)
  const [size, setSize] = useState('1.5')
  const [enableTPSL, setEnableTPSL] = useState(false)
  const [tpPrice, setTpPrice] = useState('')
  const [slPrice, setSlPrice] = useState('')

  const { balance, executePerpOrder, addToast } = useAppStore()

  const numSize = parseFloat(size || '0')
  const execPrice = orderType === 'market' ? market.price : parseFloat(limitPrice || market.price.toString())
  const margin = (numSize * execPrice) / leverage
  const liqPrice =
    direction === 'long'
      ? execPrice * (1 - (1 / leverage) * 0.9)
      : execPrice * (1 + (1 / leverage) * 0.9)

  const isDegen = leverage > 20
  const riskLabel =
    leverage > 20 ? 'Degenerate (High Risk)' : leverage > 10 ? 'Moderate Risk' : 'Healthy Perimeter'
  const riskColor =
    leverage > 20 ? 'text-negative' : leverage > 10 ? 'text-accent-amber' : 'text-tactile-mint'

  const handleOpen = () => {
    if (numSize <= 0) {
      addToast('Please enter a valid position size', 'error')
      return
    }

    if (margin > balance) {
      addToast('Insufficient margin balance available', 'error')
      return
    }

    executePerpOrder(direction, market.symbol, numSize, execPrice, leverage)
  }

  return (
    <div className="tactile-glass rounded-2xl p-5 border border-white/[0.08] shadow-tactile-card space-y-4">
      {/* Header with Perpl Badge & Margin Mode */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base text-text-primary font-display">
          Perpl Order Terminal
        </h3>
        <div className="flex items-center gap-1.5 p-0.5 rounded-lg bg-black/40 border border-white/5 text-[10px] font-bold">
          <button
            onClick={() => setMarginMode('cross')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
              marginMode === 'cross'
                ? 'bg-brand-violet text-white shadow-sm'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            Cross
          </button>
          <button
            onClick={() => setMarginMode('isolated')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
              marginMode === 'isolated'
                ? 'bg-brand-violet text-white shadow-sm'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            Isolated
          </button>
        </div>
      </div>

      {/* Direction Toggle (Long vs Short) */}
      <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-black/40 border border-white/5">
        <button
          onClick={() => setDirection('long')}
          className={`py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            direction === 'long'
              ? 'bg-tactile-mint text-white shadow-pill-mint'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          <TrendingUp size={14} /> Long (Bull)
        </button>
        <button
          onClick={() => setDirection('short')}
          className={`py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            direction === 'short'
              ? 'bg-negative text-white shadow-sm'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          <TrendingDown size={14} /> Short (Bear)
        </button>
      </div>

      {/* Order Type Selector */}
      <div className="flex gap-2 text-xs">
        <button
          onClick={() => setOrderType('market')}
          className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            orderType === 'market'
              ? 'bg-white/10 text-text-primary border border-white/10'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          Market
        </button>
        <button
          onClick={() => setOrderType('limit')}
          className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            orderType === 'limit'
              ? 'bg-white/10 text-text-primary border border-white/10'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          Limit
        </button>
      </div>

      {orderType === 'limit' && (
        <div>
          <label className="text-[11px] text-text-muted block mb-1">Limit Price (USD)</label>
          <input
            type="number"
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono text-text-primary focus:outline-none focus:border-brand-violet/50"
          />
        </div>
      )}

      {/* Leverage Slider & Quick Chips */}
      <div className="p-3 rounded-xl bg-black/20 border border-white/5 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-text-muted flex items-center gap-1">
            <Sliders size={12} /> Leverage
          </span>
          <span className={`font-bold font-mono ${riskColor}`}>
            {leverage}x • {riskLabel}
          </span>
        </div>

        <input
          type="range"
          min={1}
          max={50}
          value={leverage}
          onChange={(e) => setLeverage(parseInt(e.target.value))}
          className="w-full accent-brand-violet cursor-pointer"
        />

        <div className="flex gap-1 pt-1">
          {[2, 5, 10, 20, 50].map((lev) => (
            <button
              key={lev}
              onClick={() => setLeverage(lev)}
              className={`flex-1 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                leverage === lev
                  ? 'bg-brand-violet text-white'
                  : 'bg-white/5 text-text-muted hover:text-text-secondary'
              }`}
            >
              {lev}x
            </button>
          ))}
        </div>
      </div>

      {/* Position Size Input & Balance Presets */}
      <div>
        <div className="flex justify-between text-xs text-text-muted mb-1">
          <span>Position Size</span>
          <span className="font-mono">{market.symbol.split('-')[0]}</span>
        </div>
        <input
          type="number"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-brand-violet/50"
        />

        <div className="flex gap-1.5 mt-2">
          {[25, 50, 75, 100].map((pct) => (
            <button
              key={pct}
              onClick={() => {
                const maxMargin = balance * (pct / 100)
                const computedSize = (maxMargin * leverage) / execPrice
                setSize(computedSize.toFixed(2))
              }}
              className="flex-1 py-1 rounded-lg text-[10px] font-mono font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-text-muted hover:text-text-primary border border-white/5 transition-colors cursor-pointer"
            >
              {pct === 100 ? 'MAX' : `${pct}%`}
            </button>
          ))}
        </div>
      </div>

      {/* TP / SL Accordion Toggle */}
      <div className="pt-1">
        <button
          onClick={() => setEnableTPSL(!enableTPSL)}
          className="w-full flex items-center justify-between text-xs text-text-muted hover:text-text-secondary cursor-pointer py-1"
        >
          <span className="flex items-center gap-1">
            <ShieldCheck size={12} className="text-brand-violet" /> Take Profit / Stop Loss (Optional)
          </span>
          <ChevronDown
            size={13}
            className={`transition-transform ${enableTPSL ? 'rotate-180' : ''}`}
          />
        </button>

        {enableTPSL && (
          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/5">
            <div>
              <label className="text-[10px] text-tactile-mint block mb-0.5">Take Profit</label>
              <input
                type="number"
                placeholder="Target $"
                value={tpPrice}
                onChange={(e) => setTpPrice(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-2.5 py-1 text-xs font-mono text-text-primary focus:outline-none focus:border-tactile-mint/50"
              />
            </div>
            <div>
              <label className="text-[10px] text-negative block mb-0.5">Stop Loss</label>
              <input
                type="number"
                placeholder="Stop $"
                value={slPrice}
                onChange={(e) => setSlPrice(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-2.5 py-1 text-xs font-mono text-text-primary focus:outline-none focus:border-negative/50"
              />
            </div>
          </div>
        )}
      </div>

      {/* Calculated Risk Parameters */}
      <div className="p-3 rounded-xl bg-black/20 border border-white/5 space-y-1.5 text-xs">
        <div className="flex justify-between text-text-muted">
          <span>Required Margin</span>
          <span className="font-mono font-bold text-text-primary">
            ${margin.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-text-muted">
          <span>Est. Liquidation Price</span>
          <span className="font-mono font-bold text-negative">
            ${liqPrice.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-text-muted">
          <span>Available Margin (AUSD/USDC)</span>
          <span className="font-mono font-bold text-text-primary">
            ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Mascot warning if degen leverage */}
      {isDegen ? (
        <div className="p-2.5 rounded-xl bg-negative/10 border border-negative/25 flex items-center gap-3">
          <ClashDoodleMascot size="sm" mood="warning" showSpeech={false} />
          <p className="text-[11px] text-negative leading-tight font-medium">
            Extreme leverage! Liquidation is close to mark price.
          </p>
        </div>
      ) : (
        <div className="p-2 rounded-xl bg-tactile-mint/10 border border-tactile-mint/20 flex items-center gap-2">
          <CheckCircle2 size={13} className="text-tactile-mint" />
          <p className="text-[11px] text-tactile-mint font-medium">
            Risk guard healthy: Monad 400ms margin protection active.
          </p>
        </div>
      )}

      {/* Action Button */}
      <Button
        variant={direction === 'long' ? 'success' : 'danger'}
        onClick={handleOpen}
        className="w-full py-3 text-sm font-bold shadow-md"
      >
        <span>
          Open {direction.toUpperCase()} @ {leverage}x
        </span>
      </Button>
    </div>
  )
}

export default function PerpsArena() {
  const [selectedSymbol, setSelectedSymbol] = useState(PERP_MARKETS[0].symbol)
  const [activeTab, setActiveTab] = useState<'positions' | 'orders' | 'history'>('positions')
  const { positions } = useAppStore()

  const market =
    PERP_MARKETS.find((m) => m.symbol === selectedSymbol) || PERP_MARKETS[0]

  // Micro-fluctuation simulation for mark price to feel live
  const [liveMark, setLiveMark] = useState(market.price)
  useEffect(() => {
    setLiveMark(market.price)
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.49) * (market.price * 0.0008)
      setLiveMark((prev) => +(prev + delta).toFixed(2))
    }, 1200)
    return () => clearInterval(interval)
  }, [market.price, market.symbol])

  // Funding countdown timer simulation
  const [countdown, setCountdown] = useState('03:41:22')
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const remSeconds = 8 * 3600 - ((now.getHours() % 8) * 3600 + now.getMinutes() * 60 + now.getSeconds())
      const h = Math.floor(remSeconds / 3600).toString().padStart(2, '0')
      const m = Math.floor((remSeconds % 3600) / 60).toString().padStart(2, '0')
      const s = (remSeconds % 60).toString().padStart(2, '0')
      setCountdown(`${h}:${m}:${s}`)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const candles = useMemo(() => generateCandles(market.price), [market.symbol])

  const chartData = candles.slice(-60).map((c) => ({
    time: new Date(c.time).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    close: c.close,
  }))

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-text-primary font-display">
              Perps Arena
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-violet/15 text-brand-violet border border-brand-violet/30">
              Powered by Perpl
            </span>
            <span className="text-xs font-mono text-tactile-mint hidden sm:inline">
              400ms Sub-Second Oracles
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Decentralized perpetual futures with up to 50x leverage, cross-margin guards, and instant settlement.
          </p>
        </div>

        {/* Market Selector Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {PERP_MARKETS.map((m) => (
            <button
              key={m.symbol}
              onClick={() => setSelectedSymbol(m.symbol)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                m.symbol === market.symbol
                  ? 'bg-brand-violet/20 text-brand-violet border border-brand-violet/30 shadow-sm'
                  : 'bg-white/5 text-text-muted hover:text-text-primary'
              }`}
            >
              {m.symbol}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Chart & Orderbook + Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="tactile-glass rounded-2xl p-5 border border-white/[0.08] shadow-tactile-card">
            {/* Market Info Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-white/5">
              <div>
                <h3 className="text-xl font-black text-text-primary font-display">
                  {market.symbol}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-2xl font-black font-display text-text-primary font-mono">
                    ${liveMark.toLocaleString()}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                      market.change24h >= 0
                        ? 'bg-tactile-mint/15 text-tactile-mint'
                        : 'bg-negative/15 text-negative'
                    }`}
                  >
                    {market.change24h >= 0 ? '+' : ''}
                    {market.change24h.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs font-mono">
                <div>
                  <span className="text-text-muted block text-[10px]">Index Price</span>
                  <span className="text-text-primary font-bold">${market.price.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-text-muted block text-[10px]">Funding Rate</span>
                  <span className="text-tactile-mint font-bold">+0.0125%</span>
                </div>
                <div>
                  <span className="text-text-muted block text-[10px] flex items-center gap-1">
                    <Clock size={10} /> Next In
                  </span>
                  <span className="text-brand-violet font-bold">{countdown}</span>
                </div>
              </div>
            </div>

            {/* Area Chart */}
            <div className="h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="perpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#836EF9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#836EF9" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 9, fill: '#94A3B8' }}
                    tickLine={false}
                    axisLine={false}
                    interval={10}
                  />
                  <YAxis
                    tick={{ fontSize: 9, fill: '#94A3B8' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    width={45}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      return (
                        <div className="tactile-glass rounded-xl p-2.5 text-xs border border-white/10 shadow-xl">
                          <div className="text-text-muted mb-1">{payload[0].payload.time}</div>
                          <div className="text-text-primary font-bold">
                            Mark: ${payload[0].value?.toLocaleString()}
                          </div>
                        </div>
                      )
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="close"
                    stroke="#836EF9"
                    strokeWidth={2}
                    fill="url(#perpGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Positions & Orders Tabs */}
          <div className="tactile-glass rounded-2xl p-5 border border-white/[0.08] shadow-tactile-card">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('positions')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'positions'
                      ? 'bg-brand-violet/20 text-brand-violet'
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  Active Positions ({positions.length})
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-brand-violet/20 text-brand-violet'
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  Open Orders (0)
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'history'
                      ? 'bg-brand-violet/20 text-brand-violet'
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  Trade History
                </button>
              </div>

              <span className="text-[11px] text-text-muted font-mono hidden sm:inline">
                Auto-Deleveraging (ADL): Healthy
              </span>
            </div>

            {activeTab === 'positions' ? (
              positions.length === 0 ? (
                <div className="py-8 text-center text-text-muted text-xs">
                  No open positions. Use the Perpl terminal on the right to open your first trade!
                </div>
              ) : (
                <div className="space-y-3">
                  {positions.map((p) => (
                    <PositionRow key={p.id} position={p} />
                  ))}
                </div>
              )
            ) : activeTab === 'orders' ? (
              <div className="py-8 text-center text-text-muted text-xs">
                No active limit orders pending execution.
              </div>
            ) : (
              <div className="py-8 text-center text-text-muted text-xs">
                Recently closed positions will appear here with final booked PnL.
              </div>
            )}
          </div>
        </div>

        {/* Order Terminal Column */}
        <div>
          <TradePanel market={market} />
        </div>
      </div>
    </div>
  )
}
