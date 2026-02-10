import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/app/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-zinc-900 text-white [a&]:hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900",
        secondary:
          "border-transparent bg-zinc-100 text-zinc-900 [a&]:hover:bg-zinc-100/90 dark:bg-zinc-800 dark:text-zinc-50",
        destructive:
          "border-transparent bg-red-600 text-white [a&]:hover:bg-red-600/90 dark:bg-red-900/50 dark:text-red-50",
        outline:
          "text-zinc-950 [a&]:hover:bg-zinc-100 dark:text-zinc-50 dark:[a&]:hover:bg-zinc-800",
        success:
          "border-transparent bg-emerald-100 text-emerald-700 [a&]:hover:bg-emerald-100/90 dark:bg-emerald-900/30 dark:text-emerald-400",
        warning:
          "border-transparent bg-amber-100 text-amber-700 [a&]:hover:bg-amber-100/90 dark:bg-amber-900/30 dark:text-amber-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
