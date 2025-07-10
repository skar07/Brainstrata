import * as React from "react"
import { clsx } from "clsx"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={clsx(
          "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = "Select"

interface OptionProps extends React.OptionHTMLAttributes<HTMLOptionElement> {
  children: React.ReactNode
}

const Option = React.forwardRef<HTMLOptionElement, OptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <option
        ref={ref}
        className={clsx("py-2 px-3", className)}
        {...props}
      >
        {children}
      </option>
    )
  }
)
Option.displayName = "Option"

export { Select, Option } 