import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none dark:focus-visible:ring-slate-300",
  {
    variants: {
      variant: {
        default:
          "bg-sig-blue disabled:bg-sig-oblue text-white shadow hover:bg-sig-hblue dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90",
        destructive:
          "bg-sig-red disabled:bg-sig-ored text-white shadow-sm hover:bg-sig-hred dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90",
        outline:
          "border border-slate-200 bg-white disabled:bg-sig-ogray1 shadow-sm hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        secondary:
          "bg-sig-golden disabled:bg-sig-ogolden text-white shadow-sm hover:bg-sig-hgolden dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
        ghost: "text-base text-sig-blue disabled:bg-sig-ogray1 hover:bg-sig-gray3 hover:text-sig-hblue dark:hover:bg-slate-800 dark:hover:text-slate-50",
        link: "text-white underline-offset-4 hover:underline dark:text-slate-50",
        succes:
          "bg-sig-green disabled:bg-sig-ogreen text-white shadow hover:bg-sig-hgreen dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90",
        info:
          "bg-sig-bluesky disabled:bg-sig-obluesky text-white shadow hover:bg-sig-hbluesky dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90",
        warning: 
          "bg-sig-yellow disabled:bg-sig-oyellow text-white shadow hover:bg-sig-hyellow dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
