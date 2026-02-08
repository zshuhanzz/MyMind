import { ReactNode } from 'react';

type Variant = 'default' | 'positive' | 'negative' | 'neutral' | 'warning';

interface BadgeProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<Variant, string> = {
  default:  'bg-lavender-100 text-lavender-600',
  positive: 'bg-sage-100 text-sage-400',
  negative: 'bg-rose-100 text-rose-400',
  neutral:  'bg-warmgray-100 text-warmgray-600',
  warning:  'bg-amber-100 text-amber-400',
};

export default function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5
        text-xs font-medium font-heading
        rounded-full
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
