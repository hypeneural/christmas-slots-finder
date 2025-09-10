import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-target -webkit-tap-highlight-color-transparent",
  {
    variants: {
      variant: {
        default: "native-button bg-gradient-to-b from-primary to-primary/90 text-primary-foreground shadow-md hover:shadow-lg active:scale-[0.98]",
        destructive: "native-button bg-gradient-to-b from-destructive to-destructive/90 text-destructive-foreground shadow-md hover:shadow-lg active:scale-[0.98]",
        outline: "border border-input bg-card/50 backdrop-blur-sm hover:bg-accent/50 hover:text-accent-foreground rounded-xl shadow-sm hover:shadow-md active:scale-[0.98]",
        secondary: "native-button bg-gradient-to-b from-secondary to-secondary/90 text-secondary-foreground shadow-md hover:shadow-lg active:scale-[0.98]",
        ghost: "hover:bg-accent/30 hover:text-accent-foreground rounded-xl active:scale-[0.98]",
        link: "text-primary underline-offset-4 hover:underline active:scale-[0.98]",
        native: "native-button bg-gradient-to-b from-primary via-primary-glow to-primary text-primary-foreground shadow-lg hover:shadow-xl",
      },
      size: {
        default: "h-11 px-6 py-3 rounded-xl text-base",
        sm: "h-9 px-4 py-2 rounded-lg text-sm",
        lg: "h-14 px-8 py-4 rounded-2xl text-lg font-semibold",
        icon: "h-11 w-11 rounded-xl",
        native: "touch-xl rounded-2xl text-lg font-semibold",
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
