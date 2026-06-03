/**
 * The AI assistant glyph — a speech bubble cradling a 4-point spark, mirroring
 * the VS Code Copilot Chat icon. Stroked bubble + filled spark so it reads at
 * the small sizes used in the activity rail and title bar.
 */
export default function AssistantIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {/* speech bubble with a tail at the bottom-left */}
      <path d="M6 4h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-7l-3.5 3.5V18H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z" />
      {/* centered spark */}
      <path
        d="M12 6.5c.2 2.4 2.6 4.8 5 5-2.4.2-4.8 2.6-5 5-.2-2.4-2.6-4.8-5-5 2.4-.2 4.8-2.6 5-5z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}
