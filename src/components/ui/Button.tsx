import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--accent)] text-white hover:brightness-110 shadow-sm focus-visible:ring-[var(--accent-border)]",
  secondary:
    "bg-[var(--surface-elevated)] text-[var(--text-h)] border border-[var(--border)] hover:bg-[var(--surface-hover)]",
  ghost:
    "bg-transparent text-[var(--text)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-h)]",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-400",
  outline:
    "border border-[var(--accent-border)] text-[var(--accent)] bg-[var(--accent-bg)] hover:bg-[var(--accent)] hover:text-white",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-5 py-2.5 text-base gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      className = "",
      disabled,
      children,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = "Button";
