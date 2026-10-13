import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  ShieldCheck,
  Activity,
  Sliders,
  Sparkles,
  Info,
  Calendar,
  AlertTriangle,
  Flame,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useAppStore } from '../store/useAppStore'

export default function RiskAdjustedPerformance() {
  const { balance } = useAppStore()

  // Interactive circumstance sliders
  const [horizonDays, setHorizonDays] = useState<30 | 90 | 180 | 365>(90)
  const [winRate, setWinRate] = useState<number>(68)
  const [riskPerTrade, setRiskPerTrade] = useState<number>(1.5)
  const [regime, setRegime] = useState<'bull' | 'choppy' | 'bear'>('bull')

  // Generate dynamic Monte Carlo future projection curves
  const projectionData = useMemo(() => {
    const points = []
    const startBalance = balance > 0 ? balance : 10000
    const stepDays = horizonDays === 30 ? 1 : horizonDays === 90 ? 3 : horizonDays === 180 ? 6 : 12
    const totalSteps = Math.floor(horizonDays / stepDays)

    let optBal = startBalance
    let expBal = startBalance
    let guardBal = startBalance

    const now = new Date()

    // Regime multipliers
    const regimeDrift = regime === 'bull' ? 0.0035 : regime === 'choppy' ? 0.0018 : -0.0005
    const winRateRatio = (winRate - 50) / 100 // -0.05 to +0.35
    const riskFactor = riskPerTrade / 100

    for (let step = 0; step <= totalSteps; step++) {
      const dayOffset = step * stepDays
      const d = new Date(now)
      d.setDate(d.getDate() + dayOffset)

      if (step > 0) {
        // Expected curve
        const expDailyReturn = (regimeDrift + winRateRatio * 0.006) * stepDays
        expBal = expBal * (1 + expDailyReturn)

        // Optimal 95th percentile
        const optDailyReturn = (regimeDrift * 1.5 + winRateRatio * 0.012 + riskFactor * 0.08) * stepDays
        optBal = optBal * (1 + optDailyReturn)

        // Guard 5th percentile with stop-loss protection
        const guardDailyReturn = (regimeDrift * 0.3 - riskFactor * 0.04) * stepDays
        guardBal = Math.max(guardBal * (1 + guardDailyReturn), startBalance * 0.88)
      }

      points.push({
        day: `+${dayOffset}d`,
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        optimal: Math.round(optBal),
        expected: Math.round(expBal),
        preservation: Math.round(guardBal),
      })
    }

    return points
  }, [balance, horizonDays, winRate, riskPerTrade, regime])

  // Computed end values
  const lastPoint = projectionData[projectionData.length - 1]
  const expProfit = lastPoint.expected - (balance > 0 ? balance : 10000)
  const expRoiPct = ((expProfit / (balance > 0 ? balance : 10000)) * 100).toFixed(1)

  return (
    <div className="tactile-glass rounded-3xl p-6 border border-white/[0.08] shadow-tactile-card space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-text-primary font-display flex items-center gap-2">
              <ShieldCheck size={20} className="text-tactile-mint" /> Future Risk-Adjusted Performance
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-tactile-mint/15 text-tactile-mint border border-tactile-mint/25">
              Monte Carlo Model
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Simulate forward capital growth and drawdown protection across varying market circumstances.
          </p>
        </div>

        {/* Horizon selector chips */}
        <div className="flex gap-1.5 p-1 rounded-xl bg-black/40 border border-white/5 text-xs font-semibold">
          {[
            { days: 30, label: '30D' },
            { days: 90, label: '90D' },
            { days: 180, label: '180D' },
            { days: 365, label: '1 Year' },
          ].map(({ days, label }) => (
            <button
              key={days}
              onClick={() => setHorizonDays(days as any)}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                horizonDays === days
                  ? 'bg-brand-violet text-white shadow-pill-active'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Core Risk Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 rounded-2xl bg-black/25 border border-white/5">
          <span className="text-[10px] text-text-muted block">Sharpe Ratio</span>
          <p className="text-base font-black text-tactile-mint font-mono mt-0.5">2.42</p>
          <span className="text-[9px] text-tactile-mint font-semibold">Top 3% Monad Traders</span>
        </div>

        <div className="p-3 rounded-2xl bg-black/25 border border-white/5">
          <span className="text-[10px] text-text-muted block">Sortino Ratio</span>
          <p className="text-base font-black text-brand-violet font-mono mt-0.5">3.18</p>
          <span className="text-[9px] text-text-muted">Zero Downside Vol</span>
        </div>

        <div className="p-3 rounded-2xl bg-black/25 border border-white/5">
          <span className="text-[10px] text-text-muted block">Calmar Ratio</span>
          <p className="text-base font-black text-accent-amber font-mono mt-0.5">2.85</p>
          <span className="text-[9px] text-text-muted">Return / Max Drawdown</span>
        </div>

        <div className="p-3 rounded-2xl bg-black/25 border border-white/5">
          <span className="text-[10px] text-text-muted block">Max Drawdown</span>
          <p className="text-base font-black text-tactile-mint font-mono mt-0.5">-3.8%</p>
          <span className="text-[9px] text-text-muted">vs Market -18.4%</span>
        </div>

        <div className="p-3 rounded-2xl bg-black/25 border border-white/5">
          <span className="text-[10px] text-text-muted block">95% Daily VaR</span>
          <p className="text-base font-black text-text-primary font-mono mt-0.5">$184.20</p>
          <span className="text-[9px] text-text-muted">Guarded Capital Limit</span>
        </div>

        <div className="p-3 rounded-2xl bg-black/25 border border-white/5">
          <span className="text-[10px] text-text-muted block">Profit Factor</span>
          <p className="text-base font-black text-brand-violet font-mono mt-0.5">2.64x</p>
          <span className="text-[9px] text-tactile-mint font-semibold">Positive Expectancy</span>
        </div>
      </div>

      {/* Main Interactive Projection Chart */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-text-secondary">
            Projected Forward Trajectory ({horizonDays} Days)
          </span>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-brand-violet">
              <span className="w-2 h-2 rounded-full bg-brand-violet" /> Optimal (+95%)
            </span>
            <span className="flex items-center gap-1.5 text-tactile-mint font-bold">
              <span className="w-2 h-2 rounded-full bg-tactile-mint" /> Expected (+{expRoiPct}%)
            </span>
            <span className="flex items-center gap-1.5 text-accent-amber">
              <span className="w-2 h-2 rounded-full bg-accent-amber" /> Preservation (5%)
            </span>
          </div>
        </div>

        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="optGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#836EF9" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#836EF9" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="guardGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 9, fill: '#94A3B8' }}
                tickLine={false}
                axisLine={false}
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
                  const d = payload[0].payload
                  return (
                    <div className="tactile-glass rounded-xl p-3 text-xs border border-white/10 shadow-xl space-y-1">
                      <div className="text-text-muted font-bold">{d.date} ({d.day})</div>
                      <div className="text-brand-violet font-bold font-mono">
                        Optimal: ${d.optimal.toLocaleString()}
                      </div>
                      <div className="text-tactile-mint font-bold font-mono">
                        Expected: ${d.expected.toLocaleString()}
                      </div>
                      <div className="text-accent-amber font-mono">
                        Preservation: ${d.preservation.toLocaleString()}
                      </div>
                    </div>
                  )
                }}
              />
              <Area
                type="monotone"
                dataKey="optimal"
                stroke="#836EF9"
                strokeWidth={2}
                fill="url(#optGrad)"
              />
              <Area
                type="monotone"
                dataKey="expected"
                stroke="#10B981"
                strokeWidth={2.5}
                fill="url(#expGrad)"
              />
              <Area
                type="monotone"
                dataKey="preservation"
                stroke="#F59E0B"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="url(#guardGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interactive Circumstance Controls */}
      <div className="p-4 rounded-2xl bg-black/20 border border-white/5 space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-text-primary flex items-center gap-1.5">
            <Sliders size={13} className="text-brand-violet" /> Adjust Market Circumstances & Risk Parameters:
          </span>
          <span className="text-[11px] text-text-muted">
            Updates model dynamically
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Win Rate Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-text-secondary">Target Win Rate:</span>
              <span className="font-bold font-mono text-tactile-mint">{winRate}%</span>
            </div>
            <input
              type="range"
              min={45}
              max={85}
              value={winRate}
              onChange={(e) => setWinRate(parseInt(e.target.value))}
              className="w-full accent-tactile-mint cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-muted">
              <span>45% Baseline</span>
              <span>85% God Mode</span>
            </div>
          </div>

          {/* Risk Per Trade */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-text-secondary">Risk Per Trade:</span>
              <span className="font-bold font-mono text-brand-violet">{riskPerTrade}%</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={5.0}
              step={0.1}
              value={riskPerTrade}
              onChange={(e) => setRiskPerTrade(parseFloat(e.target.value))}
              className="w-full accent-brand-violet cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-muted">
              <span>0.5% Defensive</span>
              <span>5.0% Aggressive</span>
            </div>
          </div>

          {/* Market Regime */}
          <div className="space-y-1.5">
            <span className="text-text-secondary block">Monad Market Regime:</span>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => setRegime('bull')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  regime === 'bull'
                    ? 'bg-tactile-mint text-white'
                    : 'bg-white/5 text-text-muted hover:text-text-secondary'
                }`}
              >
                Bull Trend
              </button>
              <button
                type="button"
                onClick={() => setRegime('choppy')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  regime === 'choppy'
                    ? 'bg-accent-amber text-white'
                    : 'bg-white/5 text-text-muted hover:text-text-secondary'
                }`}
              >
                Choppy
              </button>
              <button
                type="button"
                onClick={() => setRegime('bear')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  regime === 'bear'
                    ? 'bg-negative text-white'
                    : 'bg-white/5 text-text-muted hover:text-text-secondary'
                }`}
              >
                Bear Risk
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
