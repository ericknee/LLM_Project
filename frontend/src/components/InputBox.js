import React from "react";
import "./InputBox.css";

export default function InputBox({
  value,
  onChange,
  onClear,
  placeholder,
  isInvalid,
}) {
  return (
    <div className="input-container">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input-field ${isInvalid ? "invalid" : ""}`}
      />
      <button
        className="clear-button"
        onClick={onClear}
        type="button"
      >
        x
      </button>
    </div>
  );
}
