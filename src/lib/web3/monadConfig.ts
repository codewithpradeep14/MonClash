// ─── MonClash Web3 & Monad Ecosystem Configuration ──────────────────────────

export interface MonadNetworkConfig {
  chainId: number
  chainName: string
  rpcUrl: string
  blockExplorerUrl: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
}

export const MONAD_TESTNET: MonadNetworkConfig = {
  chainId: 10143,
  chainName: 'Monad Testnet',
  rpcUrl: 'https://testnet-rpc.monad.xyz',
  blockExplorerUrl: 'https://testnet.monadexplorer.com',
  nativeCurrency: {
    name: 'Monad',
    symbol: 'MON',
    decimals: 18,
  },
}

export const MONAD_DEVNET: MonadNetworkConfig = {
  chainId: 20143,
  chainName: 'Monad Devnet',
  rpcUrl: 'https://devnet-rpc.monad.xyz',
  blockExplorerUrl: 'https://devnet.monadexplorer.com',
  nativeCurrency: {
    name: 'Monad',
    symbol: 'MON',
    decimals: 18,
  },
}

// ─── Ecosystem Protocols Config (Truthful Status) ──────────────────────────

export interface ProtocolIntegration {
  name: string
  category: 'L1 Blockchain' | 'Spot CLOB' | 'Perps Engine' | 'Stablecoin'
  status: 'Ready' | 'Connected' | 'Simulated' | 'Devnet'
  version: string
  docsUrl: string
  description: string
  features: string[]
}

export const ECOSYSTEM_INTEGRATIONS: Record<string, ProtocolIntegration> = {
  monad: {
    name: 'Monad L1',
    category: 'L1 Blockchain',
    status: 'Ready',
    version: 'Parallel EVM (v1.4)',
    docsUrl: 'https://docs.monad.xyz',
    description: 'High-throughput parallel EVM with 10,000 TPS, 400ms block times, and 800ms finality.',
    features: ['Parallel Execution', 'MonadBFT Consensus', 'Async I/O MonadDb', 'EIP-7702 Support'],
  },
  kuru: {
    name: 'Kuru DEX',
    category: 'Spot CLOB',
    status: 'Connected',
    version: 'Kuru v1 CLOB',
    docsUrl: 'https://docs.kuru.io',
    description: 'Fully onchain Central Limit Order Book and smart aggregator native to Monad.',
    features: ['Zero Pending States', 'Sub-millisecond Matching', 'Deep Onchain Depth', '0.02% Fee'],
  },
  perpl: {
    name: 'Perpl Exchange',
    category: 'Perps Engine',
    status: 'Connected',
    version: 'Perpl v2 Core',
    docsUrl: 'https://docs.perpl.xyz',
    description: 'High-frequency perpetuals engine with CLOB settlement and cross-margin risk guard.',
    features: ['Up to 50x Leverage', 'Dynamic Funding Rates', 'Instant Liquidation Guard', 'Low Slippage'],
  },
  agora: {
    name: 'Agora Finance (AUSD)',
    category: 'Stablecoin',
    status: 'Ready',
    version: 'AUSD v1',
    docsUrl: 'https://docs.agora.finance',
    description: 'The native institutional-grade, fully backed digital dollar on Monad.',
    features: ['1:1 USD Reserves', 'Zero Spread Settlement', 'Yield Stability Pool', 'Native Gas Ready'],
  },
}
