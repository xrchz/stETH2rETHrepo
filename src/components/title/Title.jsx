import React from 'react'
import classes from "./title.module.css"

const Title = () => {
  return (
    <div className={classes.container}>
        <h2>st<span className={classes.eth}>Eth</span> <span>2</span> r<span className={classes.eth}o>Eth</span></h2>
        <p>Low gas swapping protocol utilising the viem library, exchanging Ethereum for Rocket Pool tokens.</p>
    </div>
  )
}

export default Title