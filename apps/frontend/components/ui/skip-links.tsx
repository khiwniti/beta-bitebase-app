/**
 * Skip Links Component
 * 
 * Provides keyboard users with quick navigation options to skip to main content,
 * navigation, or other important page sections.
 */

import React from 'react'
import { cn } from '../../lib/utils'

interface SkipLink {
  href: string
  label: string
}

interface SkipLinksProps {
  links?: SkipLink[]
  className?: string
}

const DEFAULT_SKIP_LINKS: SkipLink[] = [
  { href: '#main-content', label: 'Skip to main content' },
  { href: '#navigation', label: 'Skip to navigation' },
  { href: '#footer', label: 'Skip to footer' }
]

const SkipLinks: React.FC<SkipLinksProps> = ({
  links = DEFAULT_SKIP_LINKS,
  className
}) => {
  return (
    <div 
      className={cn(
        "skip-links fixed top-0 left-0 z-[9999]",
        className
      )}
    >
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className={cn(
            // Hidden by default, shown on focus
            "absolute left-[-9999px] top-0",
            "focus:left-4 focus:top-4",
            // Styling
            "bg-primary text-primary-foreground",
            "px-4 py-2 rounded-md",
            "text-sm font-medium",
            "shadow-lg border-2 border-background",
            // Focus styles
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            // Transitions
            "transition-all duration-200",
            // Ensure it's above everything
            "z-[10000]"
          )}
          onKeyDown={(e) => {
            // Allow Tab to move to next skip link
            if (e.key === 'Tab' && !e.shiftKey) {
              // Default behavior - move to next focusable element
            }
            // Allow Shift+Tab to move to previous skip link
            else if (e.key === 'Tab' && e.shiftKey) {
              // Default behavior - move to previous focusable element
            }
            // Enter or Space to activate the link
            else if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              const target = document.querySelector(link.href)
              if (target instanceof HTMLElement) {
                target.focus()
                target.scrollIntoView({ behavior: 'smooth' })
              }
            }
          }}
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}

/**
 * Custom hook to add skip link targets to elements
 */
export const useSkipTarget = (id: string) => {
  return {
    id,
    tabIndex: -1, // Makes the element focusable via JavaScript
    className: 'skip-target'
  }
}

/**
 * Skip Target Component
 * Wrapper component that makes any element a valid skip link target
 */
interface SkipTargetProps {
  id: string
  children: React.ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export const SkipTarget: React.FC<SkipTargetProps> = ({
  id,
  children,
  className,
  as: Component = 'div'
}) => {
  return (
    <Component
      id={id}
      tabIndex={-1}
      className={cn('skip-target focus:outline-none', className)}
      style={{
        // Ensure the target is visible when focused
        scrollMarginTop: '1rem'
      }}
    >
      {children}
    </Component>
  )
}

export default SkipLinks