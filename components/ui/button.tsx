import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[color:var(--accent)] px-5 py-3 text-slate-950 shadow-[0_18px_60px_-24px_rgba(6,182,212,0.65)] hover:-translate-y-0.5 hover:brightness-105",
        secondary:
          "bg-[color:var(--surface)] px-5 py-3 text-[color:var(--text)] ring-1 ring-[color:var(--border)] hover:-translate-y-0.5 hover:bg-[color:var(--surface-strong)]",
        ghost:
          "px-3 py-2 text-[color:var(--muted-strong)] hover:bg-[color:var(--surface)] hover:text-[color:var(--text)]",
        link: "px-0 py-0 text-[color:var(--accent-strong)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, asChild = false, children, ...props },
  ref,
) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      className: cn(classes, (children as React.ReactElement<{ className?: string }>).props.className),
      ...props,
    });
  }

  return (
    <button className={classes} ref={ref} {...props}>
      {children}
    </button>
  );
});

export { buttonVariants };
