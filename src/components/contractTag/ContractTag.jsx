import React, { useState, useEffect } from 'react';
import classes from "./contractTag.module.css";
import { AiFillCopy, AiOutlineCheck } from "react-icons/ai";

const ContractTag = () => {
  const [address, setAddress] = useState("0xfAaBbE302750635E3F918385a1aEb4A9eb45977a");
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    // Create a reference to the text element
    const textElement = document.getElementById('addressText');

    // Create a range and select the text inside the element
    const range = document.createRange();
    range.selectNodeContents(textElement);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    // Copy the selected text to the clipboard
    document.execCommand('copy');

    // Deselect the text
    selection.removeAllRanges();

    // Set the copied state to true
    setCopied(true);
  };

  useEffect(() => {
    // Use setTimeout to set copied back to false after 1 second (1000 milliseconds)
    const timeoutId = setTimeout(() => {
      setCopied(false);
    }, 2000);

    // Clean up the timeout to avoid memory leaks
    return () => clearTimeout(timeoutId);
  }, [copied]);

  return (
    <div className={classes.container}>
      <div className={classes.addressTextClass}>
        Contract:
        <p id="addressText" className={classes.addressText} aria-disabled>{address}</p>

        {!copied && <AiFillCopy className={classes.icon} onClick={handleCopyClick} />}
        {copied && <AiOutlineCheck />}
      </div>
    </div>
  );
};

export default ContractTag;