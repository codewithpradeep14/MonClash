import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Star,
  AlertCircle,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { Button, Card, Tabs, Badge, DemoBadge } from '../components/ui'
import { useAppStore } from '../store/useAppStore'
import { MARKETS, generateCandles, generateOrderBook } from '../data/mockData'
import ClashDoodleMascot from '../components/ClashDoodleMascot'

const TIMEFRAMES = ['1m', '5m', '15m', '1h', '4h', '1D', '1W', '1M', '1Y']

function CandleChart({ market }: { market: typeof MARKETS[0] }) {
  const [tf, setTf] = useState('15m')
  const [chartMode, setChartMode] = useState<'area' | 'candles'>('area')
  const [hoveredCandle, setHoveredCandle] = useState<any>(null)

  // Generate real data stats based on the exact selected timeframe and market
  const rawCandles = useMemo(
    () => generateCandles(market.price, 60, tf, market.symbol),
    [market.symbol, market.price, tf]
  )

  // Live ticking simulation on the current active candle to reflect Monad 400ms speed
  const [liveCandles, setLiveCandles] = useState(rawCandles)
  useEffect(() => {
    setLiveCandles(rawCandles)
    const interval = setInterval(() => {
      setLiveCandles((prev) => {
        if (!prev.length) return prev
        const last = { ...prev[prev.length - 1] }
        const delta = (Math.random() - 0.49) * (market.price * (tf === '1m' ? 0.001 : 0.0004))
        last.close = +(last.close + delta).toFixed(last.close < 1 ? 4 : 2)
        last.high = Math.max(last.high, last.close)
        last.low = Math.min(last.low, last.close)
        return [...prev.slice(0, -1), last]
      })
    }, 1200)
    return () => clearInterval(interval)
  }, [rawCandles, market.price, tf])

  // Dynamic period calculations based on the actual timeframe window
  const periodHigh = Math.max(...liveCandles.map((c) => c.high))
  const periodLow = Math.min(...liveCandles.map((c) => c.low))
  const firstPrice = liveCandles[0]?.open || market.price
  const lastPrice = liveCandles[liveCandles.length - 1]?.close || market.price
  const periodChangePct = ((lastPrice - firstPrice) / firstPrice) * 100
  const isPeriodPositive = periodChangePct >= 0

  const chartData = liveCandles.map((c) => ({
    time: c.dateLabel,
    close: c.close,
    open: c.open,
    high: c.high,
    low: c.low,
    volume: Math.round(c.volume / 1000),
    isUp: c.close >= c.open,
    color: c.close >= c.open ? '#10B981' : '#FF4D6D',
  }))

  const activeCandle = hoveredCandle || chartData[chartData.length - 1]

  return (
    <div className="tactile-glass rounded-3xl p-5 border border-white/[0.08] shadow-tactile-card space-y-4">
      {/* Header with Market Info & Timeframe Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-black text-text-primary font-display">
              {market.symbol}
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-tactile-mint/15 text-tactile-mint border border-tactile-mint/25">
              Kuru CLOB Live
            </span>
            <span className="text-[10px] font-mono text-brand-violet hidden sm:inline">
              {tf.toUpperCase()} Real-Time Feed
            </span>
          </div>

          <div className="flex items-center gap-3 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-text-primary font-display font-mono">
              ${lastPrice < 100 ? lastPrice.toFixed(2) : lastPrice.toLocaleString()}
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-lg font-mono ${
                isPeriodPositive
                  ? 'bg-tactile-mint/15 text-tactile-mint'
                  : 'bg-negative/15 text-negative'
              }`}
            >
              {isPeriodPositive ? '+' : ''}
              {periodChangePct.toFixed(2)}% ({tf})
            </span>
          </div>
        </div>

        {/* Timeframe & View Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Chart Type Toggle */}
          <div className="flex rounded-xl p-0.5 bg-black/40 border border-white/5 text-[11px] font-semibold">
            <button
              onClick={() => setChartMode('area')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                chartMode === 'area'
                  ? 'bg-brand-violet text-white shadow-sm'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setChartMode('candles')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                chartMode === 'candles'
                  ? 'bg-brand-violet text-white shadow-sm'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              Candles
            </button>
          </div>

          {/* Timeframe Switcher */}
          <div className="flex gap-1 bg-black/40 rounded-xl p-1 border border-white/5 overflow-x-auto max-w-full">
            {TIMEFRAMES.map((t) => (
              <button
                key={t}
                onClick={() => setTf(t)}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                  tf === t
                    ? 'bg-brand-violet text-white shadow-pill-active'
                    : 'text-text-muted hover:text-text-secondary hover:bg-white/5'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Period Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-black/20 border border-white/5 text-xs">
        <div>
          <span className="text-text-muted text-[11px]">{tf} Period High</span>
          <p className="font-bold text-text-primary font-mono mt-0.5">
            ${periodHigh < 100 ? periodHigh.toFixed(2) : periodHigh.toLocaleString()}
          </p>
        </div>
        <div>
          <span className="text-text-muted text-[11px]">{tf} Period Low</span>
          <p className="font-bold text-text-primary font-mono mt-0.5">
            ${periodLow < 100 ? periodLow.toFixed(2) : periodLow.toLocaleString()}
          </p>
        </div>
        <div>
          <span className="text-text-muted text-[11px]">Kuru Volume ({tf})</span>
          <p className="font-bold text-text-primary font-mono mt-0.5">{market.volume}</p>
        </div>
        <div>
          <span className="text-text-muted text-[11px]">Sub-Second Finality</span>
          <p className="font-bold text-tactile-mint font-mono mt-0.5">400ms Monad CLOB</p>
        </div>
      </div>

      {/* Live Active Bar OHLC Bar */}
      {activeCandle && (
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono p-2 rounded-xl bg-black/30 border border-white/5 text-text-muted">
          <span>Date: <strong className="text-text-primary">{activeCandle.time}</strong></span>
          <span>O: <strong className="text-text-primary">${activeCandle.open}</strong></span>
          <span>H: <strong className="text-text-primary">${activeCandle.high}</strong></span>
          <span>L: <strong className="text-text-primary">${activeCandle.low}</strong></span>
          <span>C: <strong className={activeCandle.isUp ? 'text-tactile-mint' : 'text-negative'}>${activeCandle.close}</strong></span>
          <span>Vol: <strong className="text-brand-violet">{activeCandle.volume}k</strong></span>
        </div>
      )}

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 mb-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartMode === 'area' ? (
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 0, bottom: 0, left: 0 }}
              onMouseMove={(e: any) => {
                if (e?.activePayload?.[0]?.payload) {
                  setHoveredCandle(e.activePayload[0].payload)
                }
              }}
              onMouseLeave={() => setHoveredCandle(null)}
            >
              <defs>
                <linearGradient id="spotGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={isPeriodPositive ? '#10B981' : '#FF4D6D'}
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor={isPeriodPositive ? '#10B981' : '#FF4D6D'}
                    stopOpacity={0.0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                tick={{ fontSize: 9, fill: '#94A3B8' }}
                tickLine={false}
                axisLine={false}
                interval={Math.floor(chartData.length / 5)}
              />
              <YAxis
                tick={{ fontSize: 9, fill: '#94A3B8' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) =>
                  market.price > 100 ? `$${(v / 1000).toFixed(0)}k` : `$${v.toFixed(2)}`
                }
                width={45}
                domain={['auto', 'auto']}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const d = payload[0].payload
                  return (
                    <div className="tactile-glass rounded-xl p-2.5 text-xs border border-white/10 shadow-xl space-y-0.5 font-mono">
                      <div className="text-text-muted mb-1 font-sans">{d.time}</div>
                      <div className="text-text-primary font-bold">Close: ${d.close}</div>
                      <div className="text-text-muted">High: ${d.high} | Low: ${d.low}</div>
                      <div className="text-brand-violet">Vol: {d.volume}k</div>
                    </div>
                  )
                }}
              />
              <Area
                type="monotone"
                dataKey="close"
                stroke={isPeriodPositive ? '#10B981' : '#FF4D6D'}
                strokeWidth={2}
                fill="url(#spotGrad)"
              />
            </AreaChart>
          ) : (
            /* Candlestick Bars View */
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 0, bottom: 0, left: 0 }}
              onMouseMove={(e: any) => {
                if (e?.activePayload?.[0]?.payload) {
                  setHoveredCandle(e.activePayload[0].payload)
                }
              }}
              onMouseLeave={() => setHoveredCandle(null)}
            >
              <XAxis
                dataKey="time"
                tick={{ fontSize: 9, fill: '#94A3B8' }}
                tickLine={false}
                axisLine={false}
                interval={Math.floor(chartData.length / 5)}
              />
              <YAxis
                tick={{ fontSize: 9, fill: '#94A3B8' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) =>
                  market.price > 100 ? `$${(v / 1000).toFixed(0)}k` : `$${v.toFixed(2)}`
                }
                width={45}
                domain={['auto', 'auto']}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const d = payload[0].payload
                  return (
                    <div className="tactile-glass rounded-xl p-2.5 text-xs border border-white/10 shadow-xl space-y-0.5 font-mono">
                      <div className="text-text-muted mb-1 font-sans">{d.time}</div>
                      <div className="text-text-primary font-bold">Close: ${d.close}</div>
                      <div className="text-text-muted">Open: ${d.open}</div>
                      <div className="text-text-muted">High: ${d.high} | Low: ${d.low}</div>
                      <div className="text-brand-violet">Vol: {d.volume}k</div>
                    </div>
                  )
                }}
              />
              <Bar
                dataKey="close"
                shape={(props: any) => {
                  const { x, y, width, height, payload } = props
                  const fill = payload.isUp ? '#10B981' : '#FF4D6D'
                  return (
                    <rect
                      x={x + 1}
                      y={y}
                      width={Math.max(2, width - 2)}
                      height={Math.max(2, height)}
                      fill={fill}
                      rx={1}
                    />
                  )
                }}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Volume Bars */}
      <div className="h-12">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData.slice(-50)}>
            <Bar dataKey="volume" fill="rgba(131, 110, 249, 0.35)" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function OrderBook({ market }: { market: typeof MARKETS[0] }) {
  const { asks, bids } = useMemo(() => generateOrderBook(market.price), [market.symbol])
  const maxTotal = Math.max(...asks.map((a) => a.total), ...bids.map((b) => b.total))

  return (
    <div className="tactile-glass rounded-2xl p-5 border border-white/[0.08] shadow-tactile-card select-none">
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-sm text-text-primary font-display">
          Kuru Order Book
        </span>
        <span className="text-[10px] font-mono text-tactile-mint font-semibold">
          Spread: 0.01%
        </span>
      </div>

      <div className="grid grid-cols-3 text-[11px] text-text-muted mb-2 px-1 font-medium">
        <span>Price (USDC)</span>
        <span className="text-center">Size</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks (Sellers) */}
      <div className="space-y-0.5 mb-2">
        {asks.slice(0, 7).reverse().map((ask, i) => (
          <div key={i} className="relative grid grid-cols-3 text-xs py-0.5 px-1 rounded">
            <div
              className="absolute inset-0 rounded opacity-20"
              style={{
                background: '#FF4D6D',
                width: `${(ask.total / maxTotal) * 100}%`,
                right: 0,
                left: 'auto',
              }}
            />
            <span className="relative text-negative font-mono font-semibold">
              {ask.price.toFixed(market.price > 100 ? 0 : 4)}
            </span>
            <span className="relative text-center text-text-secondary font-mono">
              {ask.size.toFixed(3)}
            </span>
            <span className="relative text-right text-text-secondary font-mono">
              {ask.total.toFixed(3)}
            </span>
          </div>
        ))}
      </div>

      {/* Mid Price Spread Bar */}
      <div className="text-center py-1.5 text-xs font-bold text-text-primary bg-black/30 border-y border-white/5 my-1 font-mono rounded">
        ${market.price < 100 ? market.price.toFixed(4) : market.price.toLocaleString()}
      </div>

      {/* Bids (Buyers) */}
      <div className="space-y-0.5 mt-2">
        {bids.slice(0, 7).map((bid, i) => (
          <div key={i} className="relative grid grid-cols-3 text-xs py-0.5 px-1 rounded">
            <div
              className="absolute inset-0 rounded opacity-20"
              style={{
                background: '#10B981',
                width: `${(bid.total / maxTotal) * 100}%`,
              }}
            />
            <span className="relative text-tactile-mint font-mono font-semibold">
              {bid.price.toFixed(market.price > 100 ? 0 : 4)}
            </span>
            <span className="relative text-center text-text-secondary font-mono">
              {bid.size.toFixed(3)}
            </span>
            <span className="relative text-right text-text-secondary font-mono">
              {bid.total.toFixed(3)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function OrderForm({ market }: { market: typeof MARKETS[0] }) {
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [orderType, setOrderType] = useState<'Market' | 'Limit'>('Market')
  const [price, setPrice] = useState(market.price.toString())
  const [amount, setAmount] = useState('10')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const { balance, executeSpotOrder, addToast } = useAppStore()

  const total = parseFloat(price || '0') * parseFloat(amount || '0')

  const handleExecute = () => {
    const numAmount = parseFloat(amount || '0')
    const numPrice = parseFloat(price || '0')

    if (numAmount <= 0) {
      addToast('Please enter a valid order size', 'error')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      const success = executeSpotOrder(side, market.symbol, numAmount, numPrice)
      if (success) {
        setShowConfirmModal(false)
      }
    }, 400) // 400ms Monad block time simulation!
  }

  const pcts = [25, 50, 75, 100]

  return (
    <div className="tactile-glass rounded-2xl p-5 border border-white/[0.08] shadow-tactile-card">
      {/* Side Switcher (Buy / Sell) */}
      <div className="grid grid-cols-2 gap-2 mb-4 p-1 rounded-xl bg-black/40 border border-white/5">
        <button
          onClick={() => setSide('buy')}
          className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            side === 'buy'
              ? 'bg-tactile-mint text-white shadow-pill-mint'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          Buy {market.symbol.split('/')[0]}
        </button>
        <button
          onClick={() => setSide('sell')}
          className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            side === 'sell'
              ? 'bg-negative text-white shadow-sm'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          Sell {market.symbol.split('/')[0]}
        </button>
      </div>

      {/* Order Type Tabs */}
      <div className="flex gap-2 mb-4 text-xs font-semibold text-text-muted">
        {(['Market', 'Limit'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setOrderType(t)}
            className={`pb-1 transition-colors border-b-2 cursor-pointer ${
              orderType === t
                ? 'text-text-primary border-brand-violet'
                : 'border-transparent hover:text-text-secondary'
            }`}
          >
            {t} Order
          </button>
        ))}
      </div>

      <div className="space-y-3.5">
        {/* Price Input (if Limit) */}
        {orderType === 'Limit' && (
          <div>
            <div className="flex justify-between text-xs text-text-muted mb-1">
              <span>Limit Price</span>
              <span className="font-mono">USDC</span>
            </div>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-brand-violet/50"
            />
          </div>
        )}

        {/* Amount Input */}
        <div>
          <div className="flex justify-between text-xs text-text-muted mb-1">
            <span>Amount</span>
            <span className="font-mono">{market.symbol.split('/')[0]}</span>
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-brand-violet/50"
          />
        </div>

        {/* Percent Buttons */}
        <div className="grid grid-cols-4 gap-1.5">
          {pcts.map((pct) => (
            <button
              key={pct}
              onClick={() => {
                const maxSpend = balance * (pct / 100)
                const calcAmount = maxSpend / parseFloat(price || '1')
                setAmount(calcAmount.toFixed(2))
              }}
              className="py-1 text-xs rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary font-mono transition-colors cursor-pointer"
            >
              {pct}%
            </button>
          ))}
        </div>

        {/* Total & Available Balance */}
        <div className="pt-2 border-t border-white/5 space-y-1.5 text-xs">
          <div className="flex justify-between text-text-muted">
            <span>Available Balance</span>
            <span className="font-mono font-bold text-text-primary">
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between text-text-muted">
            <span>Order Value</span>
            <span className="font-mono font-bold text-text-primary">
              ${total.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-text-muted">
            <span>Est. Kuru Fee</span>
            <span className="font-mono text-tactile-mint font-semibold">0.02% (Sub-cent)</span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant={side === 'buy' ? 'success' : 'danger'}
          onClick={handleExecute}
          disabled={isSubmitting}
          className="w-full py-3"
        >
          {isSubmitting ? (
            <span>Executing on Monad (400ms)...</span>
          ) : (
            <span>
              {side === 'buy' ? 'Buy' : 'Sell'} {market.symbol.split('/')[0]}
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}

export default function SpotArena() {
  const { selectedMarket, setSelectedMarket } = useAppStore()
  const market = MARKETS.find((m) => m.symbol === selectedMarket) || MARKETS[0]

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Arena Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-text-primary font-display">
              Spot Arena
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-tactile-mint/15 text-tactile-mint border border-tactile-mint/30">
              Powered by Kuru
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Fully onchain Central Limit Order Book with 400ms Monad block finality.
          </p>
        </div>

        {/* Market Selector Dropdown */}
        <div className="flex items-center gap-2">
          {MARKETS.slice(0, 3).map((m) => (
            <button
              key={m.symbol}
              onClick={() => setSelectedMarket(m.symbol)}
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

      {/* Main Trading Terminal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Column */}
        <div className="lg:col-span-2 space-y-6">
          <CandleChart market={market} />
        </div>

        {/* Order Book & Form Column */}
        <div className="space-y-6">
          <OrderForm market={market} />
          <OrderBook market={market} />
        </div>
      </div>
    </div>
  )
}
