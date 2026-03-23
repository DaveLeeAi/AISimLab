type BadgeVariant = 'free' | 'pro' | 'beta' | 'coming_soon' | 'live' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  free: 'bg-emerald-100 text-emerald-700',
  pro: 'bg-blue-100 text-blue-700',
  beta: 'bg-amber-100 text-amber-700',
  coming_soon: 'bg-slate-100 text-slate-500',
  live: 'bg-green-100 text-green-700',
  neutral: 'bg-slate-100 text-slate-600',
};

export function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
