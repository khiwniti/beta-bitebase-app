# BiteBase Brand Theme Guide

## Brand Guidelines V1 2024

This guide outlines the implementation of BiteBase's brand colors following the official Brand Guidelines V1 2024.

### Primary Colors Palette

#### Mantis (Primary Color) - 90% Usage
- **Hex**: `#74C365`
- **Usage**: Dominant hue for backgrounds, headers, and large areas
- **Description**: A calming, natural green that evokes feelings of growth, health, and freshness

#### Chilli Red (Accent) - 5% Usage  
- **Hex**: `#E23D28`
- **Usage**: Call-to-action buttons, important highlights, accent colors
- **Description**: Intense red for energy, passion, and excitement

#### Saffron (Accent/Complementary) - 5% Usage
- **Hex**: `#F4C431`
- **Usage**: Secondary accents, complementary elements, warmth
- **Description**: Warm yellow for optimism, warmth, and creativity

## CSS Variables

### Primary Color Variations
```css
--primary-color: #74C365;
--primary-dark: #5fa854;
--primary-light: #e8f5e5;
--primary-50: #f0f9ee;
--primary-100: #e8f5e5;
--primary-200: #c8e6c0;
--primary-300: #a8d79b;
--primary-400: #8ed080;
--primary-500: #74C365;
--primary-600: #5fa854;
--primary-700: #4a8d43;
--primary-800: #357232;
--primary-900: #205721;
```

### Accent Colors
```css
--accent-red: #E23D28;
--accent-red-dark: #c73520;
--accent-red-light: #f8e6e3;

--accent-saffron: #F4C431;
--accent-saffron-dark: #e0b02a;
--accent-saffron-light: #fef7e0;
```

## Tailwind CSS Classes

### Primary Colors
```css
bg-primary-500    /* Background: Mantis */
text-primary-500  /* Text: Mantis */
border-primary-500 /* Border: Mantis */
```

### Accent Colors
```css
bg-accent-red-500     /* Background: Chilli Red */
bg-accent-saffron-500 /* Background: Saffron */
text-accent-red-500   /* Text: Chilli Red */
text-accent-saffron-500 /* Text: Saffron */
```

### Legacy Compatibility
```css
bg-bitebase-green   /* #74C365 */
bg-bitebase-red     /* #E23D28 */
bg-bitebase-saffron /* #F4C431 */
```

## Component Classes

### Buttons
```css
.btn-brand-primary    /* Primary Mantis button */
.btn-brand-accent     /* Chilli Red accent button */
.btn-brand-secondary  /* Saffron secondary button */
```

### Cards
```css
.card-brand-primary   /* Mantis-themed card */
.card-brand-accent    /* Chilli Red-themed card */
```

### Badges
```css
.badge-brand-primary    /* Mantis badge */
.badge-brand-accent     /* Chilli Red badge */
.badge-brand-secondary  /* Saffron badge */
```

## Usage Guidelines

### Color Distribution (90:5:5 Rule)
- **90% Mantis**: Use for primary backgrounds, navigation, headers, main content areas
- **5% Chilli Red**: Use sparingly for CTAs, alerts, important notifications, error states
- **5% Saffron**: Use for secondary accents, warnings, highlights, creative elements

### Best Practices

#### ✅ Do:
- Use Mantis as the dominant color in your layouts
- Reserve Chilli Red for important actions and alerts
- Use Saffron for secondary information and warm accents
- Maintain sufficient contrast for accessibility
- Use the provided CSS variables for consistency

#### ❌ Don't:
- Overuse accent colors (stick to the 5% guideline)
- Use Chilli Red for large background areas
- Mix too many accent colors in one component
- Ignore accessibility contrast requirements

### Examples

#### Primary Button (Chilli Red - Call to Action)
```jsx
<button className="btn-brand-accent">
  Get Started
</button>
```

#### Secondary Button (Mantis - Primary)
```jsx
<button className="btn-brand-primary">
  Learn More
</button>
```

#### Warning Badge (Saffron)
```jsx
<span className="badge-brand-secondary">
  Pending Review
</span>
```

#### Success Card (Mantis)
```jsx
<div className="card-brand-primary">
  <h3>Success!</h3>
  <p>Your restaurant data has been updated.</p>
</div>
```

## Accessibility

All brand colors meet WCAG 2.1 AA contrast requirements when used with appropriate text colors:

- **Mantis backgrounds**: Use white text
- **Chilli Red backgrounds**: Use white text  
- **Saffron backgrounds**: Use dark text (#1f2937)

## Implementation Files

- `app/globals.css` - Main CSS variables and base styles
- `tailwind.config.js` - Tailwind color configuration
- `styles/bitebase-theme.css` - Legacy theme file
- `styles/brand-theme.css` - New brand-specific utilities

## Migration Notes

When updating existing components:

1. Replace old green colors (`#10b981`) with new Mantis (`#74C365`)
2. Add Chilli Red accents for important actions
3. Use Saffron for secondary highlights
4. Update gradients to use brand colors
5. Test contrast ratios for accessibility

## Support

For questions about brand implementation, refer to the Brand Guidelines V1 2024 document or contact the design team.