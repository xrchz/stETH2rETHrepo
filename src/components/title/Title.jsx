import React from 'react'
import classes from "./title.module.css"



const Title = () => {
  return (
    <div className={classes.container}>
        <h2>Rocket <span>Rebate</span></h2>
        <p>Stake your ETH with Rocket Pool, or exchange your Lido staked ETH for a decentralized alternative...</p>
    </div>
  )
}

export default Title