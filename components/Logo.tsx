// The YŌTA wordmark: Y, an "Ō" drawn as a small cup over an arch, T and a striped A, between two dots.
export function Logo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="200 108 600 164" role="img" aria-label="YŌTA">
      <circle cx="218" cy="205" r="13" fill="#333" />
      <circle cx="781" cy="205" r="13" fill="#333" />
      <g fill="none" stroke="#111" strokeWidth="11">
        <path d="M287 116 330 191V266M373 116 330 191" />
        <path d="M383 115c22 30 112 30 134 0" />
        <path d="M383 266v-34a67 67 0 0 1 134 0v34" />
        <path d="M515 116h121M575 116v150" />
        <path d="M624 266 667 115l45 151M640 213h57M632 240h73" />
      </g>
    </svg>
  );
}
