import * as React from "react"
import { useFormContext, FieldPath, FieldValues } from "react-hook-form"
import { cn } from "@/utils/cn"

const Form = React.forwardRef<
  HTMLFormElement,
  React.FormHTMLAttributes<HTMLFormElement>
>(({ className, ...props }, ref) => (
  <form
    ref={ref}
    className={cn("space-y-6", className)}
    {...props}
  />
))
Form.displayName = "Form"

interface FormFieldProps {
  name: string
  children: React.ReactNode
  className?: string
}

const FormField = ({ name, children, className }: FormFieldProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      {children}
    </div>
  )
}

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))
FormLabel.displayName = "FormLabel"

interface FormMessageProps {
  children?: React.ReactNode
  className?: string
}

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, children, ...props }, ref) => {
    if (!children) return null
    
    return (
      <p
        ref={ref}
        className={cn("text-sm font-medium text-destructive", className)}
        {...props}
      >
        {children}
      </p>
    )
  }
)
FormMessage.displayName = "FormMessage"

export { Form, FormField, FormLabel, FormMessage }