# shadcn/ui Setup Guide

## ✅ What's Been Configured

### 1. Dependencies Installed
- `tailwindcss` - Utility-first CSS framework
- `postcss` - CSS transformation tool
- `autoprefixer` - PostCSS plugin to parse CSS and add vendor prefixes
- `tailwindcss-animate` - Tailwind CSS plugin for animations
- `class-variance-authority` - For creating variant-based component APIs
- `clsx` - Utility for constructing className strings
- `tailwind-merge` - Merge Tailwind CSS classes without style conflicts
- `lucide-react` - Beautiful & consistent icon toolkit

### 2. Configuration Files

#### `tailwind.config.js`
- Configured with dark mode support
- Custom CSS variables for theming
- Content paths for Tailwind to scan
- Animation plugin enabled

#### `postcss.config.js`
- Tailwind CSS plugin
- Autoprefixer plugin

#### `components.json`
- shadcn/ui configuration
- Style: "new-york"
- Icon library: "lucide"
- Component aliases configured

#### `tsconfig.app.json`
- Path aliases configured (`@/*` → `./src/*`)

#### `src/index.css`
- Tailwind directives added
- CSS variables for light/dark themes
- Base styles configured

### 3. Utility Functions

#### `src/lib/utils.ts`
- `cn()` function for merging Tailwind classes

### 4. shadcn/ui Components Added

Located in `src/components/ui/`:
- ✅ **Card** - Card component with header, content, title, description
- ✅ **Button** - Button component with multiple variants
- ✅ **Badge** - Badge component for labels and tags

### 5. Updated Pages

#### `src/pages/Home.tsx`
- Uses Card, Button, Badge components
- Lucide icons (Loader2, Package, Plus)
- Responsive grid layout
- Loading and error states with shadcn components
- Modern UI with hover effects

#### `src/pages/About.tsx`
- Tech stack cards with icons
- Feature list with checkmarks
- Technology badges
- Fully responsive layout

#### `src/components/Layout.tsx`
- Navigation with Button components
- Lucide Package icon
- Tailwind utility classes for layout
- Responsive design

## 🎨 Available Components

### Card
```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>
```

### Button
```tsx
import { Button } from '@/components/ui/button';

<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

### Badge
```tsx
import { Badge } from '@/components/ui/badge';

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>
```

### Icons (Lucide React)
```tsx
import { Package, Plus, Loader2, CheckCircle2 } from 'lucide-react';

<Package className="h-6 w-6" />
<Plus className="h-4 w-4" />
```

## 📦 Adding More Components

To add more shadcn/ui components:

```bash
cd client
npx shadcn@latest add [component-name]
```

Examples:
```bash
npx shadcn@latest add input
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add form
npx shadcn@latest add table
npx shadcn@latest add toast
```

## 🎨 Customization

### Theme Colors
Edit `src/index.css` to customize the color scheme by modifying CSS variables.

### Component Variants
Components use `class-variance-authority` for variants. Check each component file in `src/components/ui/` to see available variants.

## 📚 Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [Radix UI Primitives](https://www.radix-ui.com)

## 🚀 Next Steps

1. Add more shadcn components as needed
2. Create custom components using the shadcn primitives
3. Implement forms with validation
4. Add dialogs and modals for CRUD operations
5. Implement toast notifications for user feedback

