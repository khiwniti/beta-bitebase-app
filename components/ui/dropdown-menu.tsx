"use client"

import React, { useState, useRef, useEffect } from "react"

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
}>({
  isOpen: false,
  setIsOpen: () => {}
})

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block text-left">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

export function DropdownMenuTrigger({ asChild, children }: DropdownMenuTriggerProps) {
  const { isOpen, setIsOpen } = React.useContext(DropdownMenuContext)
  
  const handleClick = () => {
    setIsOpen(!isOpen)
  }
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      ...children.props
    })
  }
  
  return (
    <button onClick={handleClick}>
      {children}
    </button>
  )
}

export function DropdownMenuContent({ align = "start", className = "", children }: DropdownMenuContentProps) {
  const { isOpen, setIsOpen } = React.useContext(DropdownMenuContext)
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, setIsOpen])
  
  if (!isOpen) return null
  
  const alignmentClass = align === "end" ? "right-0" : "left-0"
  
  return (
    <div
      ref={ref}
      className={`absolute ${alignmentClass} mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 ${className}`}
    >
      <div className="py-1">
        {children}
      </div>
    </div>
  )
}

export function DropdownMenuItem({ onClick, className = "", children }: DropdownMenuItemProps) {
  const { setIsOpen } = React.useContext(DropdownMenuContext)
  
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
    setIsOpen(false)
  }
  
  return (
    <button
      onClick={handleClick}
      className={`flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${className}`}
    >
      {children}
    </button>
  )
}

export function DropdownMenuSeparator({ className = "" }: DropdownMenuSeparatorProps) {
  return <div className={`my-1 h-px bg-gray-200 ${className}`} />
}