import * as React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export default function Button({
  type = 'button',
  onClick,
  disabled = false,
  loading = false,
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  iconLeft,
  iconRight,
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus-visible:ring-blue-600',
    secondary:
      'bg-gray-200 text-gray-800 hover:bg-gray-300 focus-visible:ring-gray-400',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
  };

  const sizes: Record<ButtonSize, string> = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6 text-base',
    lg: 'h-12 px-8 text-lg',
  };

  return (
    <button
      type={type}
      onClick={loading ? undefined : (onClick as React.MouseEventHandler<HTMLButtonElement>)}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      data-loading={loading ? 'true' : 'false'}
      className={[
        base,
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ').trim()}
      {...rest}
    >
      {loading ? (
        <span className="flex items-center gap-2" aria-live="polite">
          <span
            aria-hidden
            className="w-5 h-5 border-2 border-white/80 border-t-transparent rounded-full animate-spin"
          />
          Procesando…
        </span>
      ) : (
        <span className="inline-flex items-center gap-2">
          {iconLeft && <span className="shrink-0">{iconLeft}</span>}
          <span>{children}</span>
          {iconRight && <span className="shrink-0">{iconRight}</span>}
        </span>
      )}
    </button>
  );
}
