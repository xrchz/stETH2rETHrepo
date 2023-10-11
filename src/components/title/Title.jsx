import React from 'react'
import classes from "./title.module.css"

const Title = () => {
  return (
    <div className={classes.container}>
        <h2>st<span className={classes.eth}>Eth</span> <span>2</span> r<span className={classes.eth}o>Eth</span></h2>
        <p>Low gas swapping protocol utilising the <a href="https://viem.sh/" target='_blank' rel="noreferrer">viem</a> library. Stake your ETH with Rocket Pool, or exchange your Lido staked ETH.</p>
    </div>
  )
}

export default Title