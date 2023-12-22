import React from 'react'
import classes from "./feedback.module.css"

const Feedback = () => {


    const email = "Gromandniblet@gmail.com";


    const handleSubmit = (event) => {
        event.preventDefault();
      
        const myForm = event.target;
        const formData = new FormData(myForm);
        
        fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(formData).toString(),
        })
          .then(() => console.log("Form successfully submitted"))
          .catch((error) => alert(error));
      };


    return (
        <div className={classes.container}>
            <form name="contact" method="post"  data-netlify="true" onSubmit="submit">
                <h3>Report bug to Rocket Rebate</h3>
                <input type="hidden" name="form-name"
                    value="contact" />
                <p>
                    <label>Your Name: <input type="text" name="name" /></label>
                </p>
                <p>
                    <label>Your Email: <input type="email" name="email" /></label>
                </p>
                <p>
                    <label>Message: <textarea className={classes.textarea} name="message"/></label>
                </p>
                <p>
                    <button type="submit">Send</button>
                </p>
            </form>
        </div>
    )
}

export default Feedback