# Accessibility Guide for BiteBase UI Components

This guide outlines the accessibility improvements made to the UI components and how to use them effectively.

## Overview

All UI components have been enhanced with comprehensive accessibility features including:

- **WCAG 2.1 AA compliance** - Meeting international accessibility standards
- **Keyboard navigation** - Full keyboard support for all interactive elements
- **Screen reader support** - Proper ARIA attributes and semantic markup
- **Focus management** - Clear focus indicators and logical tab order
- **Color contrast** - Adequate contrast ratios for text and interactive elements
- **Responsive design** - Components work across all device sizes and orientations

## Enhanced Components

### 1. Button Component

The enhanced Button component includes:

```tsx
import { Button } from './ui/button'

// Basic usage
<Button>Click me</Button>

// With loading state
<Button loading loadingText="Saving...">Save</Button>

// With icons
<Button leftIcon={<SaveIcon />}>Save</Button>
<Button rightIcon={<ArrowIcon />}>Next</Button>

// Different variants
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
```

**Accessibility Features:**
- Proper ARIA attributes for state management
- Loading state announcements
- Icon descriptions for screen readers
- Focus indicators and keyboard support

### 2. Input Component

The enhanced Input component includes:

```tsx
import { Input } from './ui/input'

// Basic usage with label
<Input 
  label="Email Address" 
  type="email" 
  required 
  placeholder="Enter your email"
/>

// With error state
<Input 
  label="Password" 
  type="password" 
  error="Password must be at least 8 characters"
  required 
/>

// With helper text
<Input 
  label="Username" 
  helperText="Must be unique and contain only letters and numbers"
/>

// With icons
<Input 
  label="Search" 
  leftIcon={<SearchIcon />}
  placeholder="Search products..."
/>
```

**Accessibility Features:**
- Automatic label association
- Error announcements to screen readers
- Required field indicators
- Proper ARIA descriptions and validation states

### 3. Dropdown Menu Component

The enhanced DropdownMenu component includes:

```tsx
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from './ui/dropdown-menu'

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
    <DropdownMenuItem onClick={handleCopy}>Copy</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**Accessibility Features:**
- Full keyboard navigation (Arrow keys, Home, End, Escape)
- Proper ARIA menu roles and states
- Focus management and roving tabindex
- Screen reader announcements for menu state changes

### 4. Data Table Component

The enhanced DataTable component includes:

```tsx
import { DataTable } from './ui/data-table'

const columns = [
  { key: 'name', title: 'Name', sortable: true },
  { key: 'email', title: 'Email' },
  { key: 'role', title: 'Role', sortable: true }
]

<DataTable
  title="User List"
  description="Manage your team members"
  data={users}
  columns={columns}
  searchable
  exportable
  pagination
  pageSize={10}
  ariaLabel="User management table"
/>
```

**Accessibility Features:**
- Proper table semantics with ARIA grid roles
- Sortable column announcements
- Keyboard navigation for sorting
- Screen reader-friendly pagination
- Search functionality with proper labeling

## New Accessibility Components

### 1. Skip Links

Provides keyboard users with quick navigation options:

```tsx
import { SkipLinks, SkipTarget } from './ui/skip-links'

// Add to your layout
<SkipLinks links={[
  { href: '#main-content', label: 'Skip to main content' },
  { href: '#navigation', label: 'Skip to navigation' },
  { href: '#footer', label: 'Skip to footer' }
]} />

// Mark important sections as skip targets
<SkipTarget id="main-content" as="main">
  <h1>Main Content</h1>
  {/* Your content */}
</SkipTarget>
```

### 2. Focus Trap

For modal dialogs and overlays:

```tsx
import FocusTrap from './ui/focus-trap'

<FocusTrap 
  active={isModalOpen}
  onEscape={() => setIsModalOpen(false)}
  initialFocus="[data-focus-first]"
>
  <div className="modal">
    <button data-focus-first>Close</button>
    <h2>Modal Title</h2>
    <p>Modal content...</p>
    <button>Save</button>
  </div>
</FocusTrap>

// Or use the hook
const focusTrapRef = useFocusTrap({
  active: isModalOpen,
  onEscape: () => setIsModalOpen(false)
})

<div ref={focusTrapRef}>
  {/* Modal content */}
</div>
```

### 3. Screen Reader Announcer

For dynamic content announcements:

```tsx
import { 
  ScreenReaderAnnouncer, 
  useScreenReaderAnnouncer,
  announce 
} from './ui/screen-reader-announcer'

// Component usage
const { announce, Announcer } = useScreenReaderAnnouncer()

const handleSave = async () => {
  try {
    await saveData()
    announce('Data saved successfully')
  } catch (error) {
    announce('Error saving data', 'assertive')
  }
}

return (
  <div>
    <button onClick={handleSave}>Save</button>
    <Announcer />
  </div>
)

// Global announcements
import { announce } from './ui/accessibility'

announce('Form submitted successfully', 'polite')
announce('Critical error occurred', 'assertive')
```

## Accessibility Utilities

### 1. Focus Management

```tsx
import { focusManagement } from './lib/accessibility'

// Trap focus in a container
const cleanup = focusManagement.trapFocus(containerElement)

// Move focus to an element
focusManagement.moveFocusTo(targetElement, true)

// Get first focusable element
const firstFocusable = focusManagement.getFirstFocusable(container)
```

### 2. ARIA Helpers

```tsx
import { ariaHelpers } from './lib/accessibility'

// Generate ARIA props for interactive elements
const buttonProps = ariaHelpers.getInteractiveProps({
  expanded: isOpen,
  selected: isSelected,
  disabled: isDisabled
})

<button {...buttonProps}>Toggle</button>

// Generate form field props
const fieldProps = ariaHelpers.getFormFieldProps({
  required: true,
  invalid: hasError,
  describedBy: 'field-help'
})

<input {...fieldProps} />
```

### 3. Keyboard Utilities

```tsx
import { keyboardUtils } from './lib/accessibility'

// Handle Enter/Space activation
const handleKeyDown = keyboardUtils.handlers.activateOnEnterOrSpace(() => {
  console.log('Activated!')
})

// Handle arrow navigation
const handleArrowKeys = keyboardUtils.handlers.navigateWithArrows({
  onArrowDown: () => setActiveIndex(prev => prev + 1),
  onArrowUp: () => setActiveIndex(prev => prev - 1),
  onEscape: () => setIsOpen(false)
})

<div onKeyDown={handleArrowKeys}>
  {/* Navigable content */}
</div>
```

## Best Practices

### 1. Semantic HTML
Always use semantic HTML elements when possible:
```tsx
// Good
<main>
  <h1>Page Title</h1>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/home">Home</a></li>
    </ul>
  </nav>
</main>

// Avoid
<div>
  <div>Page Title</div>
  <div>
    <div>Home</div>
  </div>
</div>
```

### 2. Proper Labeling
Ensure all interactive elements have accessible names:
```tsx
// Good
<button aria-label="Close dialog">×</button>
<input aria-label="Search products" placeholder="Search..." />

// Good - with visible label
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

### 3. Color and Contrast
Don't rely solely on color to convey information:
```tsx
// Good - uses both color and text
<span className="text-red-600">
  <ExclamationIcon className="inline mr-1" />
  Error: Field is required
</span>

// Avoid - color only
<span className="text-red-600">Field is required</span>
```

### 4. Loading States
Always provide feedback for loading states:
```tsx
// Good
<Button loading loadingText="Saving changes...">
  Save
</Button>

// Good - with announcements
const handleSubmit = async () => {
  announce('Submitting form...')
  try {
    await submitForm()
    announce('Form submitted successfully')
  } catch (error) {
    announce('Form submission failed', 'assertive')
  }
}
```

## Testing Your Implementation

### 1. Keyboard Testing
- Tab through all interactive elements
- Ensure focus is visible and logical
- Test arrow key navigation in menus/lists
- Verify Escape key closes overlays

### 2. Screen Reader Testing
- Test with NVDA (Windows), JAWS (Windows), or VoiceOver (macOS)
- Ensure all content is announced properly
- Verify dynamic content changes are announced
- Check that form errors are read aloud

### 3. Automated Testing
```tsx
import { validation } from './lib/accessibility'

// Validate accessibility in tests
const issues = validation.validateAccessibility(element)
if (issues.length > 0) {
  console.warn('Accessibility issues found:', issues)
}
```

## Common Patterns

### Modal Dialog
```tsx
import { FocusTrap, SkipTarget } from './ui/accessibility'

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <FocusTrap active onEscape={onClose}>
        <div 
          className="modal-content"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={e => e.stopPropagation()}
        >
          <h2 id="modal-title">{title}</h2>
          <button 
            onClick={onClose}
            aria-label="Close dialog"
            className="close-button"
          >
            ×
          </button>
          {children}
        </div>
      </FocusTrap>
    </div>
  )
}
```

### Form with Validation
```tsx
import { Input, Button } from './ui/accessibility'
import { useScreenReaderAnnouncer } from './ui/screen-reader-announcer'

const ContactForm = () => {
  const { announce, Announcer } = useScreenReaderAnnouncer()
  const [errors, setErrors] = useState({})

  const handleSubmit = async (data) => {
    const newErrors = validateForm(data)
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length > 0) {
      announce(`Form has ${Object.keys(newErrors).length} errors`, 'assertive')
      return
    }
    
    try {
      await submitForm(data)
      announce('Form submitted successfully')
    } catch (error) {
      announce('Submission failed. Please try again.', 'assertive')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Full Name"
        required
        error={errors.name}
      />
      <Input
        label="Email"
        type="email"
        required
        error={errors.email}
      />
      <Button type="submit">Submit</Button>
      <Announcer />
    </form>
  )
}
```

This guide provides a comprehensive overview of the accessibility improvements. All components are now WCAG 2.1 AA compliant and provide excellent user experiences for everyone, including users with disabilities.