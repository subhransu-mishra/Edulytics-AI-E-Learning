import React from "react";
import PropTypes from "prop-types";

const TypewriterText = ({ text }) => {
  return (
    <div
      className="message-text"
      style={{
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        lineHeight: "1.5",
        padding: "8px 0",
      }}
    >
      {text}
    </div>
  );
};

TypewriterText.propTypes = {
  text: PropTypes.string.isRequired,
};

export default TypewriterText;
