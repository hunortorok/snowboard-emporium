export function ImagePlaceholder({label, ratio = '1/1', className = ''}) {
  return (
    <div
      className={`relative overflow-hidden flex flex-col items-center justify-center gap-3 text-twilight-indigo-400 select-none ${className}`}
      style={{
        aspectRatio: ratio,
        background:
          'linear-gradient(135deg, var(--color-ash-brown-100) 0%, var(--color-twilight-indigo-100) 100%)',
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="opacity-50"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
      {label && (
        <span className="text-xs font-sans text-center px-6 leading-snug opacity-70 max-w-[200px]">
          {label}
        </span>
      )}
    </div>
  );
}
