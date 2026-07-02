import { type InputHTMLAttributes, forwardRef } from "react";
import { Search } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  withSearchIcon?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", withSearchIcon, ...props }, ref) => (
    <div className="relative w-full">
      {withSearchIcon && (
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none"
          aria-hidden
        />
      )}
      <input
        ref={ref}
        className={[
          "w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-h)]",
          "placeholder:text-[var(--text-muted)] transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-[var(--accent-border)] focus:border-[var(--accent)]",
          withSearchIcon ? "pl-10 pr-4 py-2.5" : "px-4 py-2.5",
          className,
        ].join(" ")}
        {...props}
      />
    </div>
  )
);

Input.displayName = "Input";
