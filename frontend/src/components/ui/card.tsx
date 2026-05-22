import { HTMLAttributes } from "react";
import { cn } from "./utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("glass-card rounded-2xl p-6", className)} {...props} />;
}
