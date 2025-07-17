/**
 * Accessibility utilities and helpers for common ARIA patterns
 */

import { useEffect, useRef, useState } from 'react'

// ARIA live region types
export type LiveRegionPoliteness = 'polite' | 'assertive' | 'off'

// Focus management utilities
export const focusManagement = {
  /**
   * Traps focus within a container element
   */
  trapFocus: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'
    ) as NodeListOf<HTMLElement>

    const firstFocusable = focusableElements[0]
    const lastFocusable = focusableElements[focusableElements.length - 1]

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      if (event.shiftKey) {
        if (document.activeElement === firstFocusable) {
          event.preventDefault()
          lastFocusable?.focus()
        }
      } else {
        if (document.activeElement === lastFocusable) {
          event.preventDefault()
          firstFocusable?.focus()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    
    // Focus the first focusable element
    firstFocusable?.focus()

    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  },

  /**
   * Returns the first focusable element in a container
   */
  getFirstFocusable: (container: HTMLElement): HTMLElement | null => {
    const focusable = container.querySelector(
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'
    ) as HTMLElement
    return focusable
  },

  /**
   * Moves focus to a specific element with optional scroll behavior
   */
  moveFocusTo: (element: HTMLElement, scrollIntoView = true) => {
    element.focus()
    if (scrollIntoView) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }
}

// ARIA announcement utilities
export const announcements = {
  /**
   * Creates a live region for screen reader announcements
   */
  createLiveRegion: (politeness: LiveRegionPoliteness = 'polite'): HTMLElement => {
    const liveRegion = document.createElement('div')
    liveRegion.setAttribute('aria-live', politeness)
    liveRegion.setAttribute('aria-atomic', 'true')
    liveRegion.className = 'sr-only'
    document.body.appendChild(liveRegion)
    return liveRegion
  },

  /**
   * Announces a message to screen readers
   */
  announce: (message: string, politeness: LiveRegionPoliteness = 'polite') => {
    const liveRegion = announcements.createLiveRegion(politeness)
    liveRegion.textContent = message
    
    // Clean up after announcement
    setTimeout(() => {
      document.body.removeChild(liveRegion)
    }, 1000)
  }
}

// ARIA attribute helpers
export const ariaHelpers = {
  /**
   * Generates common ARIA attributes for interactive elements
   */
  getInteractiveProps: (options: {
    role?: string
    expanded?: boolean
    selected?: boolean
    pressed?: boolean
    current?: string | boolean
    disabled?: boolean
    invalid?: boolean
    required?: boolean
    describedBy?: string
    labelledBy?: string
    label?: string
  }) => {
    const props: Record<string, any> = {}
    
    if (options.role) props.role = options.role
    if (typeof options.expanded === 'boolean') props['aria-expanded'] = options.expanded
    if (typeof options.selected === 'boolean') props['aria-selected'] = options.selected
    if (typeof options.pressed === 'boolean') props['aria-pressed'] = options.pressed
    if (options.current) props['aria-current'] = options.current
    if (typeof options.disabled === 'boolean') props['aria-disabled'] = options.disabled
    if (typeof options.invalid === 'boolean') props['aria-invalid'] = options.invalid
    if (typeof options.required === 'boolean') props['aria-required'] = options.required
    if (options.describedBy) props['aria-describedby'] = options.describedBy
    if (options.labelledBy) props['aria-labelledby'] = options.labelledBy
    if (options.label) props['aria-label'] = options.label
    
    return props
  },

  /**
   * Generates ARIA attributes for form fields
   */
  getFormFieldProps: (options: {
    required?: boolean
    invalid?: boolean
    describedBy?: string
    labelledBy?: string
  }) => {
    return ariaHelpers.getInteractiveProps({
      required: options.required,
      invalid: options.invalid,
      describedBy: options.describedBy,
      labelledBy: options.labelledBy
    })
  }
}

// Keyboard navigation utilities
export const keyboardUtils = {
  /**
   * Common keyboard event handlers
   */
  handlers: {
    activateOnEnterOrSpace: (callback: () => void) => (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        callback()
      }
    },

    navigateWithArrows: (options: {
      onArrowDown?: () => void
      onArrowUp?: () => void
      onArrowLeft?: () => void
      onArrowRight?: () => void
      onHome?: () => void
      onEnd?: () => void
      onEscape?: () => void
    }) => (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          options.onArrowDown?.()
          break
        case 'ArrowUp':
          event.preventDefault()
          options.onArrowUp?.()
          break
        case 'ArrowLeft':
          event.preventDefault()
          options.onArrowLeft?.()
          break
        case 'ArrowRight':
          event.preventDefault()
          options.onArrowRight?.()
          break
        case 'Home':
          event.preventDefault()
          options.onHome?.()
          break
        case 'End':
          event.preventDefault()
          options.onEnd?.()
          break
        case 'Escape':
          event.preventDefault()
          options.onEscape?.()
          break
      }
    }
  }
}

// React hooks for accessibility
export const useAccessibility = {
  /**
   * Hook for managing announcements
   */
  useAnnouncement: () => {
    const [message, setMessage] = useState('')
    const [politeness, setPoliteness] = useState<LiveRegionPoliteness>('polite')

    const announce = (msg: string, level: LiveRegionPoliteness = 'polite') => {
      setMessage(msg)
      setPoliteness(level)
      
      // Clear message after announcement
      setTimeout(() => setMessage(''), 1000)
    }

    return { message, politeness, announce }
  },

  /**
   * Hook for managing focus trap
   */
  useFocusTrap: (active: boolean) => {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (!active || !containerRef.current) return

      const cleanup = focusManagement.trapFocus(containerRef.current)
      return cleanup
    }, [active])

    return containerRef
  },

  /**
   * Hook for managing roving tabindex
   */
  useRovingTabIndex: (items: HTMLElement[], activeIndex: number) => {
    useEffect(() => {
      items.forEach((item, index) => {
        if (index === activeIndex) {
          item.tabIndex = 0
          item.focus()
        } else {
          item.tabIndex = -1
        }
      })
    }, [items, activeIndex])
  }
}

// Screen reader utilities
export const screenReader = {
  /**
   * Check if a screen reader is likely being used
   */
  isScreenReaderActive: (): boolean => {
    // This is a heuristic and not 100% reliable
    return (
      window.navigator.userAgent.includes('NVDA') ||
      window.navigator.userAgent.includes('JAWS') ||
      window.speechSynthesis?.speaking ||
      document.querySelector('[aria-live]') !== null
    )
  },

  /**
   * Gets text content for screen readers, handling complex elements
   */
  getAccessibleText: (element: HTMLElement): string => {
    const ariaLabel = element.getAttribute('aria-label')
    if (ariaLabel) return ariaLabel

    const ariaLabelledBy = element.getAttribute('aria-labelledby')
    if (ariaLabelledBy) {
      const labelElement = document.getElementById(ariaLabelledBy)
      if (labelElement) return labelElement.textContent || ''
    }

    return element.textContent || ''
  }
}

// Validation utilities for accessibility
export const validation = {
  /**
   * Validates if an element has proper accessibility attributes
   */
  validateAccessibility: (element: HTMLElement) => {
    const issues: string[] = []
    const tagName = element.tagName.toLowerCase()

    // Check for missing alt text on images
    if (tagName === 'img' && !element.getAttribute('alt')) {
      issues.push('Image missing alt attribute')
    }

    // Check for buttons without accessible names
    if (tagName === 'button' && !screenReader.getAccessibleText(element)) {
      issues.push('Button missing accessible name')
    }

    // Check for form inputs without labels
    if (['input', 'textarea', 'select'].includes(tagName)) {
      const id = element.getAttribute('id')
      const ariaLabel = element.getAttribute('aria-label')
      const ariaLabelledBy = element.getAttribute('aria-labelledby')
      const hasLabel = id && document.querySelector(`label[for="${id}"]`)

      if (!ariaLabel && !ariaLabelledBy && !hasLabel) {
        issues.push('Form field missing label')
      }
    }

    return issues
  }
}

export default {
  focusManagement,
  announcements,
  ariaHelpers,
  keyboardUtils,
  useAccessibility,
  screenReader,
  validation
}