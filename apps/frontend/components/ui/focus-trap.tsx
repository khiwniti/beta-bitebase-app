/**
 * Focus Trap Component
 * 
 * Traps focus within a container, typically used for modal dialogs, 
 * dropdowns, and other overlay components to ensure keyboard accessibility.
 */

import React, { useEffect, useRef, useCallback } from 'react'
import { cn } from '../../lib/utils'

interface FocusTrapProps {
  children: React.ReactNode
  active?: boolean
  restoreFocus?: boolean
  initialFocus?: string | HTMLElement
  className?: string
  onEscape?: () => void
}

const FocusTrap: React.FC<FocusTrapProps> = ({
  children,
  active = true,
  restoreFocus = true,
  initialFocus,
  className,
  onEscape
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Get all focusable elements within the container
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return []
    
    const focusableSelectors = [
      'a[href]',
      'area[href]',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[contenteditable]',
      '[tabindex]:not([tabindex^="-"])'
    ].join(', ')

    const elements = Array.from(
      containerRef.current.querySelectorAll(focusableSelectors)
    ) as HTMLElement[]

    return elements.filter(element => {
      return (
        element.offsetWidth > 0 ||
        element.offsetHeight > 0 ||
        element === document.activeElement
      )
    })
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!active) return

    if (event.key === 'Escape' && onEscape) {
      event.preventDefault()
      onEscape()
      return
    }

    if (event.key !== 'Tab') return

    const focusableElements = getFocusableElements()
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (!firstElement || !lastElement) return

    // Handle Tab navigation
    if (event.shiftKey) {
      // Shift + Tab (backwards)
      if (document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      }
    } else {
      // Tab (forwards)
      if (document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }
  }, [active, getFocusableElements, onEscape])

  // Set initial focus
  useEffect(() => {
    if (!active || !containerRef.current) return

    // Store the previously focused element
    if (restoreFocus) {
      previousActiveElement.current = document.activeElement as HTMLElement
    }

    // Set initial focus
    let elementToFocus: HTMLElement | null = null

    if (typeof initialFocus === 'string') {
      elementToFocus = containerRef.current.querySelector(initialFocus)
    } else if (initialFocus instanceof HTMLElement) {
      elementToFocus = initialFocus
    } else {
      // Default to first focusable element
      const focusableElements = getFocusableElements()
      elementToFocus = focusableElements[0] || containerRef.current
    }

    if (elementToFocus) {
      // Use setTimeout to ensure the element is rendered
      setTimeout(() => {
        elementToFocus?.focus()
      }, 0)
    }

    // Add keyboard event listener
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      
      // Restore focus to the previously focused element
      if (restoreFocus && previousActiveElement.current) {
        setTimeout(() => {
          previousActiveElement.current?.focus()
        }, 0)
      }
    }
  }, [active, initialFocus, restoreFocus, getFocusableElements, handleKeyDown])

  if (!active) {
    return <>{children}</>
  }

  return (
    <div
      ref={containerRef}
      className={cn('focus-trap', className)}
      data-focus-trap={active}
    >
      {children}
    </div>
  )
}

/**
 * Higher-order component that adds focus trap functionality
 */
export const withFocusTrap = <P extends object>(
  Component: React.ComponentType<P>
) => {
  const FocusTrappedComponent = React.forwardRef<any, P & FocusTrapProps>(
    (props, ref) => {
      const { active, restoreFocus, initialFocus, onEscape, ...componentProps } = props
      
      return (
        <FocusTrap
          active={active}
          restoreFocus={restoreFocus}
          initialFocus={initialFocus}
          onEscape={onEscape}
        >
          <Component {...(componentProps as P)} ref={ref} />
        </FocusTrap>
      )
    }
  )

  FocusTrappedComponent.displayName = `withFocusTrap(${Component.displayName || Component.name})`
  
  return FocusTrappedComponent
}

/**
 * Hook for manual focus trap management
 */
export const useFocusTrap = (options: {
  active?: boolean
  restoreFocus?: boolean
  initialFocus?: string | HTMLElement
  onEscape?: () => void
} = {}) => {
  const {
    active = true,
    restoreFocus = true,
    initialFocus,
    onEscape
  } = options

  const containerRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active || !containerRef.current) return

    const container = containerRef.current

    // Store the previously focused element
    if (restoreFocus) {
      previousActiveElement.current = document.activeElement as HTMLElement
    }

    // Focus management logic (same as above)
    const getFocusableElements = (): HTMLElement[] => {
      const focusableSelectors = [
        'a[href]',
        'area[href]',
        'input:not([disabled]):not([type="hidden"])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'button:not([disabled])',
        'iframe',
        'object',
        'embed',
        '[contenteditable]',
        '[tabindex]:not([tabindex^="-"])'
      ].join(', ')

      const elements = Array.from(
        container.querySelectorAll(focusableSelectors)
      ) as HTMLElement[]

      return elements.filter(element => {
        return (
          element.offsetWidth > 0 ||
          element.offsetHeight > 0 ||
          element === document.activeElement
        )
      })
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onEscape) {
        event.preventDefault()
        onEscape()
        return
      }

      if (event.key !== 'Tab') return

      const focusableElements = getFocusableElements()
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (!firstElement || !lastElement) return

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    // Set initial focus
    let elementToFocus: HTMLElement | null = null

    if (typeof initialFocus === 'string') {
      elementToFocus = container.querySelector(initialFocus)
    } else if (initialFocus instanceof HTMLElement) {
      elementToFocus = initialFocus
    } else {
      const focusableElements = getFocusableElements()
      elementToFocus = focusableElements[0] || container
    }

    if (elementToFocus) {
      setTimeout(() => {
        elementToFocus?.focus()
      }, 0)
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      
      if (restoreFocus && previousActiveElement.current) {
        setTimeout(() => {
          previousActiveElement.current?.focus()
        }, 0)
      }
    }
  }, [active, initialFocus, restoreFocus, onEscape])

  return containerRef
}

export default FocusTrap