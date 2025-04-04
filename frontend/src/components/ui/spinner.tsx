export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin h-5 w-5 text-current ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path className="opacity-75" fill="currentColor" d="..."></path>
    </svg>
  );
}
