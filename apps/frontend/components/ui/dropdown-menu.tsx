"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"

interface DropdownMenuProps {
  children: React.ReactNode
}

interface DropdownMenuTriggerProps {
  asChild?: boolean
  children: React.ReactNode
}

interface DropdownMenuContentProps {
  align?: "start" | "end"
  className?: string
  children: React.ReactNode
}

interface DropdownMenuItemProps {
  onClick?: () => void
  className?: string
  children: React.ReactNode
}

interface DropdownMenuSeparatorProps {
  className?: string
}

const DropdownMenuContext = React.createContext<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  activeIndex: number
  setActiveIndex: (index: number) => void
  itemCount: number
  setItemCount: (count: number) => void
}>({
  isOpen: false,
  setIsOpen: () => {},
  activeIndex: -1,
  setActiveIndex: () => {},
  itemCount: 0,
  setItemCount: () => {}
})

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [itemCount, setItemCount] = useState(0)
  
  return (
    <DropdownMenuContext.Provider value={{ 
      isOpen, 
      setIsOpen, 
      activeIndex, 
      setActiveIndex, 
      itemCount, 
      setItemCount 
    }}>
      <div className="relative inline-block text-left">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

export function DropdownMenuTrigger({ asChild, children }: DropdownMenuTriggerProps) {
  const { isOpen, setIsOpen, setActiveIndex } = React.useContext(DropdownMenuContext)
  const triggerRef = useRef<HTMLButtonElement>(null)
  
  const handleClick = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setActiveIndex(-1)
    }
  }
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
        event.preventDefault()
        setIsOpen(true)
        setActiveIndex(0)
        break
      case 'ArrowUp':
        event.preventDefault()
        setIsOpen(true)
        setActiveIndex(-1)
        break
      case 'Escape':
        if (isOpen) {
          event.preventDefault()
          setIsOpen(false)
          setActiveIndex(-1)
          triggerRef.current?.focus()
        }
        break
    }
  }
  
  const triggerProps = {
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    'aria-expanded': isOpen,
    'aria-haspopup': 'menu' as const,
    ref: triggerRef
  }
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...triggerProps,
      ...children.props
    })
  }
  
  return (
    <button {...triggerProps}>
      {children}
    </button>
  )
}

export function DropdownMenuContent({ align = "start", className = "", children }: DropdownMenuContentProps) {
  const { isOpen, setIsOpen, activeIndex, setActiveIndex, itemCount, setItemCount } = React.useContext(DropdownMenuContext)
  const ref = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setActiveIndex(prev => (prev + 1) % itemCount)
        break
      case 'ArrowUp':
        event.preventDefault()
        setActiveIndex(prev => prev <= 0 ? itemCount - 1 : prev - 1)
        break
      case 'Home':
        event.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        event.preventDefault()
        setActiveIndex(itemCount - 1)
        break
      case 'Escape':
        event.preventDefault()
        setIsOpen(false)
        setActiveIndex(-1)
        break
      case 'Tab':
        setIsOpen(false)
        setActiveIndex(-1)
        break
    }
  }, [isOpen, activeIndex, itemCount, setIsOpen, setActiveIndex])
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
        setActiveIndex(-1)
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
      
      // Count items on mount
      const items = ref.current?.querySelectorAll('[role="menuitem"]')
      if (items) {
        setItemCount(items.length)
      }
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, setIsOpen, setActiveIndex, handleKeyDown, setItemCount])
  
  // Focus active item
  useEffect(() => {
    if (isOpen && activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex]?.focus()
    }
  }, [activeIndex, isOpen])
  
  if (!isOpen) return null
  
  const alignmentClass = align === "end" ? "right-0" : "left-0"
  
  return (
    <div
      ref={ref}
      role="menu"
      aria-orientation="vertical"
      className={`absolute ${alignmentClass} mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 ${className}`}
    >
      <div className="py-1">
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              ...child.props,
              ref: (el: HTMLButtonElement) => {
                itemRefs.current[index] = el
              },
              'data-index': index,
              'aria-selected': activeIndex === index
            })
          }
          return child
        })}
      </div>
    </div>
  )
}

export function DropdownMenuItem({ onClick, className = "", children }: DropdownMenuItemProps) {
  const { setIsOpen, setActiveIndex, activeIndex } = React.useContext(DropdownMenuContext)
  const [index, setIndex] = useState(-1)
  
  useEffect(() => {
    const dataIndex = parseInt(String(index))
    if (!isNaN(dataIndex)) {
      setIndex(dataIndex)
    }
  }, [])
  
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
    setIsOpen(false)
    setActiveIndex(-1)
  }
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
    }
  }
  
  const handleMouseEnter = () => {
    const dataIndex = parseInt((event?.currentTarget as HTMLElement)?.getAttribute('data-index') || '-1')
    if (!isNaN(dataIndex)) {
      setActiveIndex(dataIndex)
    }
  }
  
  const isActive = activeIndex === index
  
  return (
    <button
      role="menuitem"
      tabIndex={isActive ? 0 : -1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      aria-selected={isActive}
      className={`flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none ${isActive ? 'bg-gray-100 text-gray-900' : ''} ${className}`}
    >
      {children}
    </button>
  )
}

export function DropdownMenuSeparator({ className = "" }: DropdownMenuSeparatorProps) {
  return <div role="separator" className={`my-1 h-px bg-gray-200 ${className}`} />
}