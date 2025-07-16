import * as React from "react"
import { clsx } from "clsx"

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple"
  defaultValue?: string | string[]
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  children: React.ReactNode
}

const AccordionContext = React.createContext<{
  value: string | string[]
  onValueChange: (value: string | string[]) => void
  type: "single" | "multiple"
} | null>(null)

const Accordion = ({ 
  type = "single", 
  defaultValue, 
  value, 
  onValueChange, 
  children, 
  className, 
  ...props 
}: AccordionProps) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || (type === "multiple" ? [] : ""))
  
  const currentValue = value ?? internalValue
  const handleValueChange = onValueChange ?? setInternalValue
  
  return (
    <AccordionContext.Provider value={{ value: currentValue, onValueChange: handleValueChange, type }}>
      <div className={clsx("", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx("border-b border-gray-200", className)}
      data-value={value}
      {...props}
    />
  )
)
AccordionItem.displayName = "AccordionItem"

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value?: string
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(AccordionContext)
    if (!context) throw new Error("AccordionTrigger must be used within Accordion")
    
    const item = (ref as any)?.current?.closest('[data-value]')
    const value = item?.getAttribute('data-value') || ''
    
    const isOpen = context.type === "multiple" 
      ? (context.value as string[]).includes(value)
      : context.value === value
    
    const handleClick = () => {
      if (context.type === "multiple") {
        const currentValues = context.value as string[]
        const newValues = isOpen 
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value]
        context.onValueChange(newValues)
      } else {
        context.onValueChange(isOpen ? "" : value)
      }
    }
    
    return (
      <button
        ref={ref}
        className={clsx(
          "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline text-left",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
        <svg
          className={clsx("h-4 w-4 shrink-0 transition-transform duration-200", isOpen && "rotate-180")}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    )
  }
)
AccordionTrigger.displayName = "AccordionTrigger"

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(AccordionContext)
    if (!context) throw new Error("AccordionContent must be used within Accordion")
    
    const item = (ref as any)?.current?.closest('[data-value]')
    const value = item?.getAttribute('data-value') || ''
    
    const isOpen = context.type === "multiple" 
      ? (context.value as string[]).includes(value)
      : context.value === value
    
    return (
      <div
        ref={ref}
        className={clsx(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
        {...props}
      >
        <div className={clsx("pb-4 pt-0", className)}>
          {children}
        </div>
      </div>
    )
  }
)
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } 