import { ButtonHTMLAttributes } from "react";
import { cn } from "./utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline";
};

export function Button({ className, variant = "primary", ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition",
        variant === "primary" && "bg-primary text-black shadow-glow hover:opacity-90",
        variant === "secondary" && "bg-secondary text-white hover:opacity-90",
        variant === "outline" && "border border-white/20 text-white hover:border-primary",
        className
      )}
      {...props}
    />
  );
}
