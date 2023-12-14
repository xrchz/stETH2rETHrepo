import 'dotenv/config'
import { ethers } from 'ethers'
import http from 'node:http'

const provider = new ethers.JsonRpcProvider(process.env.RPC)
const rocketRebate = new ethers.Contract('0xfAaBbE302750635E3F918385a1aEb4A9eb45977a',
  ['event Deposit(address indexed sender, uint256 ETH, uint256 rETH, uint256 stETH)',
   'event Drain(address indexed sender, uint256 ETH, uint256 stETH)'],
  provider)

const deployBlock = 18198548

const currentBlockNumber = await provider.getBlockNumber()

const savedLogs = []

const MAX_QUERY_SIZE = 8192

async function processLog(log) {
  const item = {}
  item.eventName = log.eventName
  item.args = Array.from(log.args).slice(1).map(n => n.toString())
  const receipt = await log.getTransactionReceipt()
  item.gasUsed = receipt.gasUsed.toString()
  item.gasPrice = receipt.gasPrice.toString()
  item.txHash = receipt.hash
  const block = await log.getBlock()
  item.timestamp = block.timestamp
  savedLogs.push(item)
}

let block = deployBlock
while (block <= currentBlockNumber) {
  const min = block
  const max = Math.min(currentBlockNumber, block + MAX_QUERY_SIZE)
  const logs = await rocketRebate.queryFilter('Deposit', min, max)
  await Promise.all(logs.map(processLog))
}

rocketRebate.addListener('Deposit', processLog)

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(savedLogs))
})

server.listen(process.env.SOCKET)
