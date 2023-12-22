import React from 'react'
import classes from "./feedback.module.css"

const Feedback = () => {


    const email = "Gromandniblet@gmail.com";


    const handleDefault = (e) => {
        e.preventDefault();
    }


    return (
        <div className={classes.container}>
            <form name="contact" method="POST"  onSubmit={(e) => {handleDefault(e)}} data-netlify="true">
                <h3>Report bug to Rocket Rebate</h3>
                <input type="hidden" name="subject"
                    value="Bug report from frank.b.mchugh@gmail.com" />
                <p>
                    <label>Your Name: <input type="text" name="name" /></label>
                </p>
                <p>
                    <label>Your Email: <input type="email" name="email" /></label>
                </p>
                <p>
                    <label>Message: <textarea className={classes.textarea} name="message"></textarea></label>
                </p>
                <p>
                    <button type="submit">Send</button>
                </p>
            </form>
        </div>
    )
}

export default Feedback