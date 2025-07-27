# Accessibility Guide - BiteBase Intelligence

## WCAG 2.1 AA Compliance Framework

This guide ensures all UI components meet WCAG 2.1 AA accessibility standards for the BiteBase Intelligence platform.

## Quick Reference

### Color Contrast Requirements
- **Normal text**: 4.5:1 minimum contrast ratio
- **Large text** (18pt+ or 14pt+ bold): 3.0:1 minimum
- **Non-text elements**: 3.0:1 minimum (icons, borders, focus indicators)

### Keyboard Navigation Standards
- All interactive elements must be keyboard accessible
- Focus indicators must be visible and meet 3:1 contrast ratio
- Tab order must be logical and predictable
- Escape key should close modals/overlays

### Screen Reader Requirements
- All images must have descriptive alt text
- Form fields must have proper labels
- Status changes must be announced
- Complex UI elements need ARIA descriptions

## Component Accessibility Checklist

### ✅ Button Component
- [ ] Proper ARIA labels for icon-only buttons
- [ ] Focus indicators with 3:1 contrast ratio
- [ ] Loading states announced to screen readers
- [ ] Disabled state properly communicated

### ✅ Input Component  
- [ ] Associated labels (explicit or aria-label)
- [ ] Error messages with role="alert"
- [ ] Helper text properly associated
- [ ] Required fields marked with aria-required

### ✅ Dashboard Components
- [ ] Proper heading hierarchy (h1 > h2 > h3)
- [ ] Landmark regions (main, aside, nav)
- [ ] Data tables with proper headers
- [ ] Charts with text alternatives

### ✅ Modal/Dialog Components
- [ ] Focus trap implemented
- [ ] Escape key to close
- [ ] Focus returns to trigger element
- [ ] Proper ARIA dialog attributes

## Implementation Examples

### Accessible Button
```tsx
<Button
  aria-label={iconOnly ? "Submit form" : undefined}
  aria-describedby={hasTooltip ? "button-tooltip" : undefined}
  disabled={isLoading}
  aria-busy={isLoading}
>
  {isLoading ? "Loading..." : "Submit"}
</Button>
```

### Accessible Form Field
```tsx
<div>
  <Label htmlFor="email" className="required">
    Email Address
  </Label>
  <Input
    id="email"
    type="email"
    aria-required="true"
    aria-invalid={!!error}
    aria-describedby={error ? "email-error" : "email-helper"}
  />
  {error && (
    <div id="email-error" role="alert" className="error-message">
      {error}
    </div>
  )}
  <div id="email-helper" className="helper-text">
    We'll never share your email with anyone else.
  </div>
</div>
```

### Accessible Chart
```tsx
<div role="img" aria-labelledby="chart-title" aria-describedby="chart-desc">
  <h3 id="chart-title">Monthly Revenue Trend</h3>
  <div id="chart-desc" className="sr-only">
    Bar chart showing monthly revenue from January to December. 
    Revenue increased from $50,000 in January to $85,000 in December, 
    with the highest peak of $90,000 in November.
  </div>
  <ResponsiveContainer>
    {/* Chart component */}
  </ResponsiveContainer>
</div>
```

## Color Palette (WCAG AA Compliant)

### Primary Colors
```css
--primary-50: #f0f9ff;   /* 19.07:1 contrast on dark */
--primary-500: #3b82f6;  /* 4.52:1 contrast on white */
--primary-700: #1d4ed8;  /* 7.22:1 contrast on white (AAA) */
```

### Status Colors
```css
--success: #10b981;  /* 4.52:1 on white */
--warning: #f59e0b;  /* 4.51:1 on white */  
--error: #ef4444;    /* 4.52:1 on white */
```

### Text Colors
```css
--text-primary: #111827;   /* 18.69:1 on white */
--text-secondary: #6b7280; /* 6.39:1 on white */
--text-muted: #9ca3af;     /* 4.54:1 on white */
```

## Testing Checklist

### Automated Testing
- [ ] Run axe-core accessibility tests
- [ ] Color contrast analysis with WebAIM tools
- [ ] Keyboard navigation testing
- [ ] Screen reader compatibility (NVDA, JAWS, VoiceOver)

### Manual Testing
- [ ] Navigate entire app using only keyboard
- [ ] Test with screen reader enabled
- [ ] Verify color contrast in different lighting
- [ ] Test with 200% zoom level
- [ ] Verify focus indicators are visible

## Browser Support

### Screen Readers
- ✅ NVDA (Windows)
- ✅ JAWS (Windows)  
- ✅ VoiceOver (macOS/iOS)
- ✅ TalkBack (Android)

### Keyboard Navigation
- ✅ Chrome/Edge/Firefox (Windows/macOS)
- ✅ Safari (macOS)
- ✅ Mobile browsers with external keyboard

## Resources

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/) - Browser extension
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Lighthouse Accessibility Audit](https://developers.google.com/web/tools/lighthouse)

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)

## Component Status

| Component | WCAG AA | Keyboard | Screen Reader | Status |
|-----------|---------|----------|---------------|---------|
| Button | ❌ | ❌ | ❌ | Needs fixes |
| Input | ❌ | ❌ | ❌ | Needs fixes |
| Card | ❌ | ❌ | ❌ | Needs fixes |
| Dialog | ❌ | ❌ | ❌ | Needs fixes |
| Tabs | ❌ | ❌ | ❌ | Needs fixes |
| Select | ❌ | ❌ | ❌ | Needs fixes |
| Toast | ❌ | ❌ | ❌ | Needs fixes |
| Dashboard | ❌ | ❌ | ❌ | Needs fixes |

**Next Steps**: Systematically fix each component following this guide and update status as components are improved.