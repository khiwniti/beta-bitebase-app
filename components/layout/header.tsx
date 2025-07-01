"use client"

import React from "react"

interface HeaderProps {
  onOpenSidebar: () => void
  userName?: string
  restaurantName?: string
}

export default function Header({ onOpenSidebar, userName, restaurantName }: HeaderProps) {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="text-lg font-semibold text-gray-900">
          {restaurantName || "BiteBase"}
        </div>
      </div>
      <div className="text-sm text-gray-600">
        Welcome, {userName || "User"}
      </div>
    </div>
  )
}