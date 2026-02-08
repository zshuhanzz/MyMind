interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse-soft bg-lavender-100 rounded-card ${className}`}
      aria-hidden="true"
    />
  );
}
