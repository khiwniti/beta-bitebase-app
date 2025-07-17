/**
 * Screen Reader Announcer Component
 * 
 * Provides dynamic announcements to screen readers through ARIA live regions.
 * Useful for notifying users of state changes, form validation, or other
 * dynamic content updates.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { cn } from '../../lib/utils'

type PolitenessLevel = 'polite' | 'assertive' | 'off'

interface ScreenReaderAnnouncerProps {
  message?: string
  politeness?: PolitenessLevel
  clearAfter?: number
  className?: string
}

/**
 * Screen Reader Announcer Component
 */
const ScreenReaderAnnouncer: React.FC<ScreenReaderAnnouncerProps> = ({
  message = '',
  politeness = 'polite',
  clearAfter = 5000,
  className
}) => {
  const [currentMessage, setCurrentMessage] = useState(message)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (message) {
      setCurrentMessage(message)
      
      // Clear the message after the specified time
      if (clearAfter > 0) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        
        timeoutRef.current = setTimeout(() => {
          setCurrentMessage('')
        }, clearAfter)
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [message, clearAfter])

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className={cn("sr-only", className)}
    >
      {currentMessage}
    </div>
  )
}

/**
 * Hook for managing screen reader announcements
 */
export const useScreenReaderAnnouncer = (options: {
  politeness?: PolitenessLevel
  clearAfter?: number
} = {}) => {
  const { politeness = 'polite', clearAfter = 5000 } = options
  const [message, setMessage] = useState('')
  const [key, setKey] = useState(0)
  
  const announce = useCallback((newMessage: string, customPoliteness?: PolitenessLevel) => {
    setMessage(newMessage)
    // Force re-render to ensure announcement is picked up by screen readers
    setKey(prev => prev + 1)
  }, [])

  const clear = useCallback(() => {
    setMessage('')
  }, [])

  const AnnouncerComponent = useCallback(() => (
    <ScreenReaderAnnouncer
      key={key}
      message={message}
      politeness={politeness}
      clearAfter={clearAfter}
    />
  ), [key, message, politeness, clearAfter])

  return {
    announce,
    clear,
    message,
    Announcer: AnnouncerComponent
  }
}

/**
 * Global announcer for application-wide announcements
 */
class GlobalAnnouncer {
  private static instance: GlobalAnnouncer
  private container: HTMLDivElement | null = null
  private politeRegion: HTMLDivElement | null = null
  private assertiveRegion: HTMLDivElement | null = null

  private constructor() {
    this.init()
  }

  public static getInstance(): GlobalAnnouncer {
    if (!GlobalAnnouncer.instance) {
      GlobalAnnouncer.instance = new GlobalAnnouncer()
    }
    return GlobalAnnouncer.instance
  }

  private init() {
    if (typeof window === 'undefined') return

    // Create container
    this.container = document.createElement('div')
    this.container.id = 'screen-reader-announcer'
    this.container.className = 'sr-only'
    
    // Create polite region
    this.politeRegion = document.createElement('div')
    this.politeRegion.setAttribute('aria-live', 'polite')
    this.politeRegion.setAttribute('aria-atomic', 'true')
    this.politeRegion.setAttribute('role', 'status')
    
    // Create assertive region
    this.assertiveRegion = document.createElement('div')
    this.assertiveRegion.setAttribute('aria-live', 'assertive')
    this.assertiveRegion.setAttribute('aria-atomic', 'true')
    this.assertiveRegion.setAttribute('role', 'alert')
    
    this.container.appendChild(this.politeRegion)
    this.container.appendChild(this.assertiveRegion)
    
    // Add to DOM
    document.body.appendChild(this.container)
  }

  public announce(message: string, politeness: PolitenessLevel = 'polite', clearAfter = 5000) {
    if (!message.trim()) return

    const region = politeness === 'assertive' ? this.assertiveRegion : this.politeRegion
    if (!region) return

    // Set the message
    region.textContent = message

    // Clear after specified time
    if (clearAfter > 0) {
      setTimeout(() => {
        if (region.textContent === message) {
          region.textContent = ''
        }
      }, clearAfter)
    }
  }

  public clear() {
    if (this.politeRegion) this.politeRegion.textContent = ''
    if (this.assertiveRegion) this.assertiveRegion.textContent = ''
  }
}

/**
 * Convenience function for global announcements
 */
export const announce = (message: string, politeness: PolitenessLevel = 'polite', clearAfter = 5000) => {
  const announcer = GlobalAnnouncer.getInstance()
  announcer.announce(message, politeness, clearAfter)
}

/**
 * Context for managing announcements throughout the app
 */
interface AnnouncerContextType {
  announce: (message: string, politeness?: PolitenessLevel) => void
  clear: () => void
}

const AnnouncerContext = React.createContext<AnnouncerContextType>({
  announce: () => {},
  clear: () => {}
})

/**
 * Provider for announcer context
 */
interface AnnouncerProviderProps {
  children: React.ReactNode
  politeness?: PolitenessLevel
  clearAfter?: number
}

export const AnnouncerProvider: React.FC<AnnouncerProviderProps> = ({
  children,
  politeness = 'polite',
  clearAfter = 5000
}) => {
  const { announce: hookAnnounce, clear, Announcer } = useScreenReaderAnnouncer({
    politeness,
    clearAfter
  })

  const contextValue: AnnouncerContextType = {
    announce: hookAnnounce,
    clear
  }

  return (
    <AnnouncerContext.Provider value={contextValue}>
      {children}
      <Announcer />
    </AnnouncerContext.Provider>
  )
}

/**
 * Hook to use the announcer context
 */
export const useAnnouncer = () => {
  const context = React.useContext(AnnouncerContext)
  if (!context) {
    throw new Error('useAnnouncer must be used within an AnnouncerProvider')
  }
  return context
}

/**
 * Higher-order component that provides announcement functionality
 */
export const withAnnouncer = <P extends object>(
  Component: React.ComponentType<P & { announce?: (message: string) => void }>
) => {
  const AnnouncerComponent = React.forwardRef<any, P>((props, ref) => {
    const { announce } = useAnnouncer()
    
    return (
      <Component
        {...props}
        announce={announce}
        ref={ref}
      />
    )
  })

  AnnouncerComponent.displayName = `withAnnouncer(${Component.displayName || Component.name})`
  
  return AnnouncerComponent
}

export default ScreenReaderAnnouncer