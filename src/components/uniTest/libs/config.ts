import { Token } from '@uniswap/sdk-core'
import { WETH_TOKEN, WSTETH_TOKEN, RETH_TOKEN, USDC_TOKEN } from './constants.ts'
import { FeeAmount } from '@uniswap/v3-sdk'


// Sets if the example should run locally or on chain
export enum Environment {
  LOCAL,
  WALLET_EXTENSION,
  MAINNET,
}

// Inputs that configure this example to run
export interface ExampleConfig {
  env: Environment
  rpc: {
    local: string
    mainnet: string
  }
  wallet: {
    address: string
    privateKey: string
  }
  tokens: {
    in: Token
    amountIn: number
    out: Token,
    poolFee: number
  }
}

// Example Configuration

export const CurrentConfig: ExampleConfig = {
  env: Environment.MAINNET,
  rpc: {
    local: 'http://localhost:8545',
    mainnet: 'https://mainnet.infura.io/v3/713d3fd4fea04f0582ee78560e6c47e4',
  },
  wallet: {
    address: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    privateKey:
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  },
  tokens: {


    in: USDC_TOKEN,
    amountIn: 1,
    out: WETH_TOKEN,
    poolFee: FeeAmount.MEDIUM,
  },
}