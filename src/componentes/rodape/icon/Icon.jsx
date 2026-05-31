import React from "react";
import "./icon.css";

const icons = {
  chevronDown: (
    <path
      d="M6 9l6 6 6-6"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  ),
  mail: (
    <>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        ry="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M3 7l9 7 9-7"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </>
  ),
  phone: (
    <path
      d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2.1.7 3.1a2 2 0 0 1-.4 2.1L8 10.4a16 16 0 0 0 5.6 5.6l1.5-1.3a2 2 0 0 1 2.1-.4c1 .4 2.1.6 3.1.7A2 2 0 0 1 22 16.9z"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  ),
  instagram: (
    <>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        ry="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" />
    </>
  ),
  whatsapp: (
    <>
      <path
        d="M20.5 11.8a8.5 8.5 0 0 1-12.3 7.5L3.5 21l1.7-4.6A8.5 8.5 0 1 1 20.5 11.8z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M9.1 8.8c.2-.4.5-.4.8-.4h.7c.2 0 .5 0 .6.4.2.5.7 1.7.8 1.9.1.2.1.4 0 .6-.1.2-.2.4-.4.6-.2.2-.4.4-.5.5-.2.2-.3.4-.1.7.2.4.9 1.4 2 2.2 1.3 1 2.3 1.2 2.7 1.3.4.1.6.1.8-.2.2-.2.8-.9 1-1.2.2-.3.4-.2.7-.1.3.1 1.7.8 2 1 .2.1.4.2.4.4 0 .2-.1 1-.7 1.6-.6.6-1.3.9-2.2.9-.9 0-2-.2-3.6-1-1.6-.8-2.6-1.8-3.5-2.9-.9-1.1-1.4-2.2-1.5-3.1-.1-.9.2-1.7.6-2.2z"
        fill="currentColor"
      />
    </>
  ),
};

function Icon({ name, className = "", ariaHidden = true }) {
  if (!icons[name]) return null;

  return (
    <svg
      aria-hidden={ariaHidden}
      className={`icon ${className}`.trim()}
      viewBox="0 0 24 24"
    >
      {icons[name]}
    </svg>
  );
}

export default Icon;
