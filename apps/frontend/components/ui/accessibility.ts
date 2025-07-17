/**
 * Accessibility Components and Utilities Index
 * 
 * Central export file for all accessibility-related components and utilities
 */

// Components
export { default as SkipLinks, SkipTarget, useSkipTarget } from './skip-links'
export { default as FocusTrap, withFocusTrap, useFocusTrap } from './focus-trap'
export { 
  default as ScreenReaderAnnouncer, 
  useScreenReaderAnnouncer, 
  announce, 
  AnnouncerProvider, 
  useAnnouncer, 
  withAnnouncer 
} from './screen-reader-announcer'

// Utilities
export {
  focusManagement,
  announcements,
  ariaHelpers,
  keyboardUtils,
  useAccessibility,
  screenReader,
  validation
} from '../../lib/accessibility'

// Types
export type { 
  LiveRegionPoliteness 
} from '../../lib/accessibility'

// Re-export enhanced components with accessibility improvements
export { Button } from './button'
export { Input } from './input'
export { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from './dropdown-menu'
export { DataTable } from './data-table'