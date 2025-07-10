import * as React from "react"
import { clsx } from "clsx"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "warning" | "success"
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "border-gray-200 bg-gray-50 text-gray-900",
      destructive: "border-red-200 bg-red-50 text-red-900",
      warning: "border-yellow-200 bg-yellow-50 text-yellow-900",
      success: "border-green-200 bg-green-50 text-green-900",
    }
    
    return (
      <div
        ref={ref}
        className={clsx(
          "relative w-full rounded-lg border p-4",
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={clsx("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  )
)
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx("text-sm", className)}
      {...props}
    />
  )
)
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription } 