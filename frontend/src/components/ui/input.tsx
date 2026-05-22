import { InputHTMLAttributes } from "react";
import { cn } from "./utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary",
        className
      )}
      {...props}
    />
  );
}
