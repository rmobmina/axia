import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-11 w-full rounded-xl border-2 border-mist-200 bg-white px-3.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-mist-400 focus:outline-none',
        className,
      )}
      {...props}
    />
  ),
)
Input.displayName = 'Input'

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'w-full rounded-xl border-2 border-mist-200 bg-white px-3.5 py-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-mist-400 focus:outline-none',
      className,
    )}
    {...props}
  />
))
Textarea.displayName = 'Textarea'

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  return (
    <label
      className={cn('mb-1.5 block text-sm font-semibold text-ink-900', className)}
      {...props}
    />
  )
}
