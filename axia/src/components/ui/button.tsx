import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 cursor-pointer select-none',
  {
    variants: {
      variant: {
        primary: 'bg-navy-700 text-white hover:bg-navy-800 active:bg-navy-950',
        secondary: 'bg-mist-100 text-navy-800 hover:bg-mist-200 active:bg-mist-300',
        outline:
          'border-2 border-mist-300 bg-white text-navy-800 hover:border-mist-400 hover:bg-mist-50',
        ghost: 'text-navy-800 hover:bg-mist-100',
        ghostOnDark: 'text-mist-200 hover:bg-white/10 hover:text-white',
        success: 'bg-good-600 text-white hover:bg-good-700',
        destructive: 'bg-alert-600 text-white hover:bg-alert-700',
      },
      size: {
        sm: 'h-9 px-3.5 text-sm [&_svg]:size-4',
        md: 'h-11 px-5 text-sm [&_svg]:size-4.5',
        lg: 'h-13 px-7 text-base [&_svg]:size-5',
        icon: 'h-11 w-11 [&_svg]:size-5',
        iconLg: 'h-14 w-14 rounded-2xl [&_svg]:size-6',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
)
Button.displayName = 'Button'

export { buttonVariants }
