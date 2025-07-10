import * as React from "react"
import { clsx } from "clsx"

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(e.target.checked)
      }
      if (onChange) {
        onChange(e)
      }
    }
    
    return (
      <input
        type="checkbox"
        ref={ref}
        checked={checked}
        onChange={handleChange}
        className={clsx(
          "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2",
          className
        )}
        {...props}
      />
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox } 