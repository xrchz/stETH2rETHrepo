import 'dotenv/config'
import { ethers } from 'ethers'
import http from 'node:http'
import fs from 'node:fs'

const provider = new ethers.JsonRpcProvider(process.env.RPC)
const rocketRebate = new ethers.Contract('0xfAaBbE302750635E3F918385a1aEb4A9eb45977a',
  ['event Deposit(address indexed sender, uint256 ETH, uint256 rETH, uint256 stETH)',
   'event Drain(address indexed sender, uint256 ETH, uint256 stETH)'],
  provider)

const deployBlock = 18198548

const currentBlockNumber = await provider.getBlockNumber()

const savedLogs = []
const seenLogs = new Set()

const MAX_QUERY_SIZE = 8192

const timestamp = () => (new Date()).toLocaleString()

async function processLog(log) {
  const receipt = await log.getTransactionReceipt()
  const id = `${receipt.hash}:${log.transactionIndex}`
  if (seenLogs.has(id)) return
  console.log(`${timestamp()} adding log ${id}`)
  seenLogs.add(id)
  const item = {}
  item.eventName = log.eventName
  item.args = {
    ETH: log.args[1].toString(),
    rETH: log.args[2].toString(),
    stETH: log.args[3].toString()
  }
  item.gasUsed = receipt.gasUsed.toString()
  item.gasPrice = receipt.gasPrice.toString()
  item.txHash = receipt.hash
  const block = await log.getBlock()
  item.timestamp = block.timestamp
  savedLogs.push(item)
}

let block = deployBlock
while (block < currentBlockNumber) {
  const min = block
  const max = Math.min(currentBlockNumber, block + MAX_QUERY_SIZE)
  console.log(`${timestamp()} Fetching logs from ${min} to ${max}...`)
  const logs = await rocketRebate.queryFilter('Deposit', min, max)
  await Promise.all(logs.map(processLog))
  block = max
}

console.log(`${timestamp()} Sorting ${savedLogs.length} logs`)
savedLogs.sort((a,b) => a.timestamp - b.timestamp)

console.log(`${timestamp()} Computing JSON`)
let savedJson = JSON.stringify(savedLogs)

async function processNewLog(log) {
  await processLog(log)
  console.log(`${timestamp()} Recomputing JSON`)
  savedJson = JSON.stringify(savedLogs)
}

rocketRebate.addListener('Deposit', processNewLog)

const server = http.createServer((req, res) => {
  console.log(`${timestamp()} Serving request from ${req.headers['origin']}`)
  const ETag = `"${savedLogs.length}"`
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', 'https://rocketrebate.io')
  res.setHeader('ETag', ETag)
  const ifNoneMatch = req.headers['if-none-match']
  if (ifNoneMatch === ETag) {
    console.log(`${timestamp()} ETag ${ETag} unchanged: responding 304`)
    res.statusCode = 304
    res.end()
  }
  else
    res.end(savedJson)
})

server.on('listening', () => fs.chmodSync(process.env.SOCKET, 0o777))
server.listen(process.env.SOCKET)
process.on('SIGINT', () => { fs.unlinkSync(process.env.SOCKET); process.exit() })
