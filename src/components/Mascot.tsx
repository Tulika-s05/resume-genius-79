export function Mascot({
  size = 48,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label="CVision mascot"
      className={className}
    >
      <path
        d="M32 5c1.4 8.6 5.2 14.3 11.4 17.4 4.6 2.3 9.6 2.9 15 3.1-5.9 1.6-10.6 3.7-14.1 7-4 3.8-6.4 9.2-7.6 16.6-1.3-7.9-4-13.4-8.4-17.1-3.7-3.1-8.4-4.9-14.2-6.3 6.1-.8 11-2.4 14.6-5.6C31.5 17.4 33 12.4 32 5Z"
        fill="var(--color-card)"
        stroke="var(--color-primary)"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <circle cx="27" cy="27" r="2" fill="var(--color-primary)" />
      <circle cx="37" cy="27" r="2" fill="var(--color-primary)" />
      <path
        d="M27.5 33c1.4 1.6 3 2.4 4.7 2.4s3.2-.8 4.4-2.4"
        stroke="var(--color-primary)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="22" cy="31.5" r="1.6" fill="var(--color-primary)" opacity="0.25" />
      <circle cx="42" cy="31.5" r="1.6" fill="var(--color-primary)" opacity="0.25" />
    </svg>
  );
}
