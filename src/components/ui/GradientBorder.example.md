# GradientBorder Component Usage

## Overview

The `GradientBorder` component creates an animated gradient border effect using a pseudo-element with conic-gradient. It's designed to add visual polish and depth to cards, containers, and interactive elements throughout the portfolio.

## Basic Usage

```tsx
import { GradientBorder } from './components/ui/GradientBorder'

function MyCard() {
  return (
    <GradientBorder>
      <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl">
        <h3>Card Title</h3>
        <p>Card content goes here</p>
      </div>
    </GradientBorder>
  )
}
```

## Integration with Project Cards

To add the GradientBorder to project cards on hover:

```tsx
import { GradientBorder } from '../ui/GradientBorder'
import { motion } from 'framer-motion'

export function ProjectCard({ project }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered ? (
        <GradientBorder duration={3000}>
          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl">
            {/* Card content */}
          </div>
        </GradientBorder>
      ) : (
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200">
          {/* Card content */}
        </div>
      )}
    </motion.div>
  )
}
```

## Integration with About Section Photo Frame

To add an animated gradient border to the photo frame:

```tsx
import { GradientBorder } from '../ui/GradientBorder'

export function About() {
  return (
    <section>
      <GradientBorder 
        duration={3000}
        colors={['#8b5cf6', '#a78bfa', '#c4b5fd', '#8b5cf6']}
        className="inline-block"
      >
        <img 
          src="/profile.jpg" 
          alt="Profile" 
          className="rounded-2xl w-64 h-64 object-cover"
        />
      </GradientBorder>
    </section>
  )
}
```

## Props

### `children` (required)
- Type: `ReactNode`
- Description: Content to render inside the bordered container

### `colors` (optional)
- Type: `string[]`
- Description: Array of CSS color values for the gradient. Colors will be used in a conic-gradient.
- Default: `['#8b5cf6', '#a78bfa', '#c4b5fd', '#8b5cf6']` (violet to purple gradient)

Example with custom colors:
```tsx
<GradientBorder 
  colors={['#ef4444', '#f97316', '#eab308', '#ef4444']}
>
  <div>Content</div>
</GradientBorder>
```

### `duration` (optional)
- Type: `number`
- Description: Animation duration in milliseconds. Per requirements, should be between 2000ms and 4000ms.
- Default: `3000` (3 seconds)

Example with faster animation:
```tsx
<GradientBorder duration={2000}>
  <div>Content</div>
</GradientBorder>
```

### `width` (optional)
- Type: `number`
- Description: Border width in pixels
- Default: `2`

Example with thicker border:
```tsx
<GradientBorder width={4}>
  <div>Content</div>
</GradientBorder>
```

### `className` (optional)
- Type: `string`
- Description: Additional CSS classes to apply to the container
- Default: `''`

Example with custom styling:
```tsx
<GradientBorder className="inline-block hover:scale-105 transition-transform">
  <div>Content</div>
</GradientBorder>
```

## Features

### Animated Conic Gradient
The component uses a conic-gradient that animates smoothly around the border, creating a flowing color effect.

### Pseudo-Element Implementation
Uses `::before` pseudo-element for the border, keeping the DOM clean and allowing the border to be layered independently from content.

### Border-Radius Matching
The border automatically inherits the border-radius from the parent container, ensuring consistent rounded corners.

### GPU Acceleration
The animation uses `background-position` which is GPU-accelerated for smooth 60fps performance.

### Theme Awareness
Default colors are theme-aware violet/purple shades that work well in both light and dark modes.

## Animation Details

The gradient border animates using the `gradient-rotate` keyframe:
1. **0%**: Starting position (0%, 50%)
2. **50%**: Moves to (100%, 50%)
3. **100%**: Returns to (0%, 50%)

This creates a smooth, continuous rotation effect around the border.

## Styling Considerations

### Content Background
The content inside GradientBorder should have its own background to ensure the border is visible:

```tsx
<GradientBorder>
  {/* ✅ Good: Has background */}
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6">
    Content
  </div>
</GradientBorder>

<GradientBorder>
  {/* ❌ Bad: No background, border won't be visible */}
  <div className="p-6">
    Content
  </div>
</GradientBorder>
```

### Border Radius
Apply border-radius to the GradientBorder container, not the child:

```tsx
{/* ✅ Good: Border radius on container */}
<GradientBorder className="rounded-2xl">
  <div className="bg-white rounded-2xl p-6">
    Content
  </div>
</GradientBorder>

{/* ❌ Bad: Border radius only on child */}
<GradientBorder>
  <div className="bg-white rounded-2xl p-6">
    Content
  </div>
</GradientBorder>
```

### Z-Index Layering
The pseudo-element has `z-index: -1` to stay behind content. Ensure parent has proper stacking context:

```tsx
<div className="relative">
  <GradientBorder>
    <div className="relative z-10 bg-white rounded-2xl p-6">
      Content will be above the border
    </div>
  </GradientBorder>
</div>
```

## Performance Considerations

- Uses CSS keyframes for animation (no JavaScript animation loops)
- GPU-accelerated via `background-position` animation
- Minimal re-renders due to CSS custom properties
- Respects `prefers-reduced-motion` (handled by global CSS)
- Pointer events disabled on pseudo-element to not interfere with interactions

## Use Cases

### Project Cards
Add visual polish to project cards on hover:
```tsx
<GradientBorder duration={3000}>
  <ProjectCard project={project} />
</GradientBorder>
```

### Photo Frames
Create an animated border around profile photos:
```tsx
<GradientBorder duration={3000} width={3}>
  <img src="/profile.jpg" alt="Profile" className="rounded-2xl" />
</GradientBorder>
```

### Featured Elements
Highlight featured content with an animated border:
```tsx
<GradientBorder 
  colors={['#8b5cf6', '#ec4899', '#8b5cf6']}
  duration={2500}
>
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-8">
    <span className="text-xs font-bold">FEATURED</span>
    <h3>Featured Project</h3>
  </div>
</GradientBorder>
```

### Call-to-Action Buttons
Add emphasis to important buttons:
```tsx
<GradientBorder duration={2000} width={2}>
  <button className="bg-violet-600 text-white rounded-lg px-6 py-3">
    Get in Touch
  </button>
</GradientBorder>
```

## Accessibility

- The border is purely decorative and doesn't affect content accessibility
- Pointer events are disabled on the pseudo-element to not interfere with interactions
- Animation respects `prefers-reduced-motion` via global CSS rules
- No impact on keyboard navigation or screen readers

## Browser Support

- Modern browsers with CSS custom properties support
- Fallback: Static border for browsers without animation support
- Uses standard CSS properties (no experimental features)

## Requirements Validation

This component validates:
- **Requirement 2.4**: Animated Gradient_Glow border on hover
- **Requirement 2.5**: Gradient animation with duration between 2000ms and 4000ms (default 3000ms)

## Advanced Examples

### Pulsing Border with Opacity
Combine with CSS animations for additional effects:
```tsx
<GradientBorder 
  duration={3000}
  className="animate-pulse-border"
>
  <div className="bg-white rounded-2xl p-6">
    Content
  </div>
</GradientBorder>
```

### Conditional Border on Hover
Show border only on hover state:
```tsx
function Card() {
  const [showBorder, setShowBorder] = useState(false)
  
  return (
    <div 
      onMouseEnter={() => setShowBorder(true)}
      onMouseLeave={() => setShowBorder(false)}
    >
      {showBorder ? (
        <GradientBorder>
          <div className="bg-white rounded-2xl p-6">Content</div>
        </GradientBorder>
      ) : (
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          Content
        </div>
      )}
    </div>
  )
}
```

### Multiple Borders
Layer multiple GradientBorder components for complex effects:
```tsx
<GradientBorder colors={['#8b5cf6', '#a78bfa', '#8b5cf6']} duration={3000}>
  <GradientBorder colors={['#ec4899', '#f472b6', '#ec4899']} duration={2000} width={1}>
    <div className="bg-white rounded-2xl p-6">
      Content with double animated border
    </div>
  </GradientBorder>
</GradientBorder>
```
