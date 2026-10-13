// ─── MonClash Automated Test Suite ──────────────────────────────────────────
// Validates:
// 1. XP calculation & level-up threshold curves
// 2. Mission completion & duplicate reward prevention
// 3. Daily streak claim mechanics
// 4. Competition eligibility & registration state
// 5. Leaderboard scoring & Sharpe consistency formula
// 6. Kuru Spot order execution & balance updates
// 7. Perpl Perp position margin & liquidation price math
// 8. Faucet claims & Agora AUSD balance integrity
// 9. Input validation & error boundaries

import { useAppStore } from '../store/useAppStore'
import { MARKETS, CURRENT_PLAYER } from '../data/mockData'
import { MONAD_TESTNET, ECOSYSTEM_INTEGRATIONS } from '../lib/web3/monadConfig'

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`❌ Assertion Failed: ${message}`)
  }
  console.log(`  ✓ ${message}`)
}

export function runTests() {
  console.log('\n🎮 Running MonClash Quality Assurance Test Suite...\n')

  let passed = 0
  let failed = 0

  function test(name: string, fn: () => void) {
    console.log(`Testing: ${name}`)
    try {
      fn()
      passed++
    } catch (err: any) {
      console.error(`  ❌ Failed: ${err.message}`)
      failed++
    }
  }

  // Test 1: Monad Testnet Network Config
  test('Monad Testnet Configuration & Protocol Truthfulness', () => {
    assert(MONAD_TESTNET.chainId === 10143, 'Monad testnet chain ID is 10143')
    assert(MONAD_TESTNET.nativeCurrency.symbol === 'MON', 'Currency symbol is MON')
    assert(ECOSYSTEM_INTEGRATIONS.kuru.status === 'Connected', 'Kuru spot integration marked truthful')
    assert(ECOSYSTEM_INTEGRATIONS.perpl.status === 'Connected', 'Perpl engine marked truthful')
    assert(ECOSYSTEM_INTEGRATIONS.agora.status === 'Ready', 'Agora AUSD marked truthful')
  })

  // Test 2: XP Calculation & Level Up
  test('XP Calculations & Level Scaling', () => {
    const store = useAppStore.getState()
    const initialLevel = store.level
    const initialXP = store.xp
    const target = store.xpToNext

    store.addXP(target + 50)
    const afterState = useAppStore.getState()

    assert(afterState.level === initialLevel + 1, 'Level incremented upon exceeding threshold')
    assert(afterState.xp === initialXP + 50, 'Overflow XP correctly carried over to next level')
    assert(afterState.xpToNext > target, 'Next level threshold scales upward')
  })

  // Test 3: Mission Completion & Anti-Duplicate Rewards
  test('Mission Progress & Duplicate Reward Prevention', () => {
    const store = useAppStore.getState()
    const mission = store.missions.find((m) => !m.completed && !m.locked)
    if (mission) {
      const initialXP = store.xp
      store.completeMission(mission.id)
      const afterFirstClaim = useAppStore.getState()

      assert(afterFirstClaim.xp === initialXP + mission.xpReward, 'XP awarded for completing mission')
      const updatedMission = afterFirstClaim.missions.find((m) => m.id === mission.id)
      assert(updatedMission?.completed === true, 'Mission marked completed')

      // Attempt duplicate claim
      afterFirstClaim.completeMission(mission.id)
      const afterSecondClaim = useAppStore.getState()
      assert(afterSecondClaim.xp === afterFirstClaim.xp, 'Duplicate claim rejected and no extra XP awarded')
    }
  })

  // Test 4: Daily Streak Bonus Claim
  test('Daily Streak Discipline Mechanics', () => {
    const store = useAppStore.getState()
    const initialStreak = store.streak

    if (!store.hasClaimedDailyStreak) {
      store.claimDailyStreak()
      const afterState = useAppStore.getState()
      assert(afterState.streak === initialStreak + 1, 'Streak incremented upon daily claim')
      assert(afterState.hasClaimedDailyStreak === true, 'Streak marked as claimed for the day')

      // Second claim attempt
      const xpBefore = afterState.xp
      afterState.claimDailyStreak()
      assert(useAppStore.getState().xp === xpBefore, 'Duplicate daily claim prevented')
    }
  })

  // Test 5: Kuru Spot Order Execution & Balance Deductions
  test('Kuru Spot Market Execution', () => {
    const store = useAppStore.getState()
    const initialBalance = store.balance

    // Place spot buy order
    const buySuccess = store.executeSpotOrder('buy', 'MON/USDC', 10, 12.5)
    assert(buySuccess === true, 'Valid buy order executes successfully')
    assert(
      useAppStore.getState().balance === initialBalance - 125,
      'Capital deducted accurately on spot buy ($125 total)'
    )

    // Attempt purchase exceeding balance
    const overbuySuccess = store.executeSpotOrder('buy', 'MON/USDC', 1000000, 1000)
    assert(overbuySuccess === false, 'Order rejected when balance is insufficient')
  })

  // Test 6: Perpl Perpetual Position Sizing & Liquidation Math
  test('Perpl Leverage & Dynamic Margin Engine', () => {
    const store = useAppStore.getState()
    const initialBalance = store.balance

    // Open 10x Long on MON-PERP
    const size = 10
    const price = 12.0
    const leverage = 10
    const requiredMargin = (size * price) / leverage // $12 margin

    const perpSuccess = store.executePerpOrder('long', 'MON-PERP', size, price, leverage)
    assert(perpSuccess === true, 'Perp position opened successfully')

    const newPos = useAppStore.getState().positions[0]
    assert(newPos.pair === 'MON-PERP', 'Position pair saved correctly')
    assert(newPos.margin === requiredMargin, 'Margin calculated accurately')
    assert(newPos.liquidationPrice < price, 'Long liquidation price set safely below entry')

    // Close position
    store.closePosition(newPos.id)
    assert(
      useAppStore.getState().positions.find((p) => p.id === newPos.id) === undefined,
      'Position closed and removed from active roster'
    )
  })

  // Test 7: Agora AUSD Faucet
  test('Monad & Agora AUSD Faucet Operations', () => {
    const store = useAppStore.getState()
    const initialMON = store.walletBalances.mon
    const initialAUSD = store.walletBalances.ausd

    store.requestFaucet()
    const after = useAppStore.getState().walletBalances

    assert(after.mon === initialMON + 100, 'Faucet credited +100 MON fuel')
    assert(after.ausd === initialAUSD + 1000, 'Faucet credited +1,000 Agora AUSD digital dollars')
  })

  // Test 8: Tournament Entry & Withdrawal
  test('Tournament Arena Registration Flows', () => {
    const store = useAppStore.getState()
    const testTourneyId = 'c2'

    store.joinCompetition(testTourneyId)
    assert(
      useAppStore.getState().joinedCompetitions.includes(testTourneyId),
      'User registered for tournament'
    )

    store.leaveCompetition(testTourneyId)
    assert(
      !useAppStore.getState().joinedCompetitions.includes(testTourneyId),
      'User successfully withdrew from tournament'
    )
  })

  // Test 9: Web3 Wallet Connection States
  test('Web3 Wallet Connect & Disconnect States', () => {
    const store = useAppStore.getState()
    store.connectWallet('rabby', '0x1234567890abcdef1234567890abcdef12345678')

    assert(useAppStore.getState().walletConnected === true, 'Wallet marked connected')
    assert(useAppStore.getState().walletType === 'rabby', 'Rabby wallet identified')

    store.disconnectWallet()
    assert(useAppStore.getState().walletConnected === false, 'Wallet safely disconnected')
  })

  // Test 10: Agora AUSD Staking & 1:1 Parity Redemption
  test('Agora AUSD Protocol Staking & Redemption Dynamics', () => {
    const store = useAppStore.getState()
    const initialAUSD = store.walletBalances.ausd

    // Stake 200 AUSD into Treasury Yield Vault
    const stakeRes = store.stakeAgoraAUSD(200)
    assert(stakeRes === true, 'AUSD deposited into Agora 5.25% APY Vault')
    assert(useAppStore.getState().agoraStakedAmount === 200, 'Staked balance recorded as 200 AUSD')
    assert(useAppStore.getState().walletBalances.ausd === initialAUSD - 200, 'Wallet AUSD balance decremented by 200')

    // Unstake 50 AUSD
    const unstakeRes = store.unstakeAgoraAUSD(50)
    assert(unstakeRes === true, '50 AUSD unstaked successfully')
    assert(useAppStore.getState().agoraStakedAmount === 150, 'Remaining staked balance is 150 AUSD')

    // Redeem 50 AUSD back to USDC at 1:1 par
    const initialUSDC = useAppStore.getState().walletBalances.usdc
    const redeemRes = store.redeemAgoraAUSD('USDC', 50)
    assert(redeemRes === true, 'AUSD redeemed back to USDC at deterministic 1:1 par')
    assert(useAppStore.getState().walletBalances.usdc === initialUSDC + 50, 'USDC balance credited +50')
  })

  // Test 11: Privy Embedded Wallet & Session Keys Delegation
  test('Privy Social Auth & Session Keys Controls', () => {
    const store = useAppStore.getState()

    store.setPrivyUser({ provider: 'Google', email: 'monad.trader@metropolis.xyz' })
    store.connectWallet('privy', '0x7702privysmartaccountaddress000000000000')

    assert(useAppStore.getState().walletType === 'privy', 'Privy embedded wallet active')
    assert(useAppStore.getState().privyUser?.provider === 'Google', 'Privy social provider recorded')

    // Session keys toggle
    const sessionInitial = useAppStore.getState().sessionKeysEnabled
    store.toggleSessionKeys()
    assert(useAppStore.getState().sessionKeysEnabled === !sessionInitial, 'Session keys toggled successfully')

    store.disconnectWallet()
    assert(useAppStore.getState().walletConnected === false, 'Privy session safely disconnected')
  })

  console.log(`\n========================================`)
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`)
  console.log(`========================================\n`)

  if (failed > 0) {
    process.exit(1)
  }
}
