import React, { useState } from "react";
import PropTypes from "prop-types";

// This component shows the raw text of an AI response for debugging purposes
const DebugResponseViewer = ({ text }) => {
  const [showRaw, setShowRaw] = useState(false);

  // Function to convert text to a more readable debug format
  const formatDebugText = (text) => {
    if (!text) return "Empty response";

    // Replace invisible characters with visible representations
    return text
      .replace(/\n/g, "↵\n") // Newlines
      .replace(/\t/g, "→   ") // Tabs
      .replace(/\s{2,}/g, (match) => "·".repeat(match.length)) // Multiple spaces
      .replace(/[^\x20-\x7E\n→·↵]/g, (char) => {
        // Show non-printable characters as their Unicode code point
        const codePoint = char.codePointAt(0).toString(16).padStart(4, "0");
        return `\\u${codePoint}`;
      });
  };

  return (
    <div className="debug-viewer">
      <button onClick={() => setShowRaw(!showRaw)} className="debug-toggle-btn">
        {showRaw ? "Hide Raw Text" : "Debug: Show Raw Text"}
      </button>

      {showRaw && (
        <div className="debug-raw-text">
          <pre>{formatDebugText(text)}</pre>
          <div className="debug-info">
            <p>Length: {text?.length || 0} characters</p>
            <p>First 50 chars: {text?.substring(0, 50)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

DebugResponseViewer.propTypes = {
  text: PropTypes.string,
};

export default DebugResponseViewer;
