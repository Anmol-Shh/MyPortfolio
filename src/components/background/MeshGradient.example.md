# MeshGradient Component Usage

## Overview

The `MeshGradient` component creates an animated mesh gradient overlay with multiple color stops that smoothly transitions using CSS keyframes. It's designed for use in the Hero section to add visual depth and interest.

## Basic Usage

```tsx
import { MeshGradient } from './components/background/MeshGradient'
import { useTheme } from './hooks/useTheme'

function Hero() {
  const { theme } = useTheme()
  
  return (
    <section className="relative min-h-screen">
      {/* Add MeshGradient as a background layer */}
      <MeshGradient theme={theme} />
      
      {/* Your content here */}
      <div className="relative z-10">
        <h1>Hero Content</h1>
      </div>
    </section>
  )
}
```

## Integration with Existing Hero Section

To add the MeshGradient to the existing Hero section in `src/components/sections/Hero.tsx`:

```tsx
import { MeshGradient } from '../background/MeshGradient'

export function Hero({ theme }: HeroProps) {
  return (
    <section className="relative ...">
      {/* Existing backgrounds */}
      <HeroBackground theme={theme} />
      <BackgroundPattern theme={theme} pattern="dots" opacity={0.05} />
      
      {/* Add MeshGradient */}
      <MeshGradient theme={theme} />
      
      {/* Rest of the content */}
    </section>
  )
}
```

## Props

### `theme` (required)
- Type: `'light' | 'dark'`
- Description: Current theme mode. The component automatically adapts colors based on the theme.

### `colorStops` (optional)
- Type: `string[]`
- Description: Array of CSS color values for gradient stops. Must have at least 3 colors.
- Default: Theme-aware colors (violet, indigo, purple with appropriate opacity)

Example with custom colors:
```tsx
<MeshGradient 
  theme={theme}
  colorStops={[
    'rgba(255, 0, 0, 0.1)',
    'rgba(0, 255, 0, 0.1)',
    'rgba(0, 0, 255, 0.1)',
  ]}
/>
```

### `animationDuration` (optional)
- Type: `number`
- Description: Animation duration in milliseconds
- Default: `8000` (8 seconds)

Example with faster animation:
```tsx
<MeshGradient 
  theme={theme}
  animationDuration={5000}
/>
```

## Features

### Theme Adaptation
The component automatically adjusts opacity and colors based on the current theme:
- **Dark theme**: Higher opacity (0.15, 0.12, 0.1) for more visible gradients
- **Light theme**: Lower opacity (0.08, 0.06, 0.05) for subtle effect

### GPU Acceleration
The component uses `will-change: background-position` to leverage GPU acceleration for smooth 60fps animations.

### Fallback Support
Provides a solid background color fallback for browsers that don't support gradient animations.

### Accessibility
- Uses `aria-hidden="true"` since it's decorative
- Uses `pointer-events-none` to not interfere with interactions
- Positioned with `-z-10` to stay behind content

## Animation Details

The mesh gradient animates through 4 keyframe stops:
1. **0%/100%**: Starting position (0%, 0%)
2. **25%**: Moves to (100%, 50%)
3. **50%**: Moves to (100%, 100%)
4. **75%**: Moves to (50%, 50%)

This creates a smooth, continuous loop that adds subtle motion to the background.

## Performance Considerations

- Uses CSS transforms and background-position for GPU-accelerated animations
- Respects `prefers-reduced-motion` (should be handled at the parent level)
- Minimal re-renders due to memoized styles
- No JavaScript animation loops - pure CSS keyframes

## Layering with Other Backgrounds

The MeshGradient works well when layered with other background components:

```tsx
<section className="relative">
  {/* Base layer: Particles (z-index: -10) */}
  <HeroBackground theme={theme} />
  
  {/* Pattern layer (z-index: -10) */}
  <BackgroundPattern theme={theme} pattern="dots" />
  
  {/* Gradient overlay (z-index: -10) */}
  <MeshGradient theme={theme} />
  
  {/* Bottom fade (z-index: 0) */}
  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/90" />
  
  {/* Content (z-index: 10) */}
  <div className="relative z-10">...</div>
</section>
```

## Requirements Validation

This component validates:
- **Requirement 1.4**: Animated Mesh_Gradient overlay with at least 3 color stops
- **Requirement 1.5**: Theme adaptation maintaining appropriate contrast ratios
