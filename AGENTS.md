# AGENTS.md - Development Guidelines for TabSync Client

This document provides essential guidelines for agentic coding agents working in the TabSync Client repository.

## Build & Development Commands

### Core Commands
- `yarn dev` - Start development server (Vite)
- `yarn build` - Build for production (TypeScript compile + Vite build)
- `yarn lint` - Run ESLint on all files
- `yarn preview` - Preview production build locally
- `yarn deploy` - Build and deploy to Firebase

### Testing
- No test framework currently configured (no test files found in src/)
- Testing setup available: @testing-library/react, @testing-library/jest-dom
- Jest configured via setupTests.ts

## Project Architecture

### Tech Stack
- **Frontend**: React 19.2.3 with TypeScript
- **Build Tool**: Vite 6.1.0
- **UI Framework**: Material-UI (@mui/material) + custom shadcn/ui components
- **Styling**: Tailwind CSS + CSS Modules + Material-UI styling
- **State Management**: React hooks (useState, useEffect, useCallback, useMemo)
- **Backend**: Supabase (authentication + database)
- **Routing**: React Router DOM v7
- **PWA**: Vite PWA plugin

### Directory Structure
```
src/
├── components/          # React components
│   ├── ui/            # shadcn/ui primitive components
│   └── [feature].tsx  # Feature-specific components
├── pages/             # Route-level components
├── clients/           # API/backend client functions
├── hooks/             # Custom React hooks
├── interfaces/        # TypeScript type definitions
├── lib/               # Utility functions
├── utils/             # Domain-specific utilities
└── styles/            # CSS Modules
```

## Code Style Guidelines

### TypeScript Configuration
- **Strict mode enabled**: All TypeScript strict rules enforced
- **Path aliases**: `@/*` maps to `./src/*`
- **JSX**: React JSX transform enabled
- **Target**: ES2020 with modern module resolution

### Import/Export Patterns
```typescript
// External libraries (grouped)
import React, { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import { User } from "@supabase/supabase-js";

// Internal imports (absolute paths with @ alias)
import { getUser, signIn } from "@/clients";
import { ITab } from "@/interfaces/iTab";
import { cn } from "@/lib/utils";
import Home from "@/pages/Home";
```

### Component Architecture
```typescript
// Functional components with TypeScript interfaces
interface IComponentProps {
  user?: User;
  onAction: (data: SomeType) => void;
}

const Component = ({ user, onAction }: IComponentProps) => {
  // Hooks at the top
  const [state, setState] = useState<Type>();
  const navigate = useNavigate();
  
  // Event handlers
  const handleClick = useCallback(() => {
    // handler logic
  }, [dependencies]);
  
  // Effects
  useEffect(() => {
    // effect logic
  }, [dependencies]);
  
  // Render
  return (
    <div className={cn("base-styles", props.className)}>
      {/* JSX content */}
    </div>
  );
};

export default Component;
```

### Naming Conventions
- **Components**: PascalCase (e.g., `HomeSidebar`, `UrlGridItem`)
- **Functions/Variables**: camelCase (e.g., `getUser`, `openTabs`)
- **Interfaces**: Prefix with `I` (e.g., `ITab`, `IHomeProps`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `LAST_SAVED_ORDER_BY_KEY`)
- **Files**: kebab-case for utilities, PascalCase for components

### Error Handling Patterns
```typescript
// API functions return { data, error } objects
const signIn = async ({ email, password }: SignInParams) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { data, error };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

// Component error handling
const onSignIn = async ({ email, password }: SignInParams) => {
  const { error, data } = await signIn({ email, password });
  
  if (error) {
    return { error: error.message };
  }
  
  setUser(data.user);
  navigate(ROUTES.HOME);
  return { error: "" };
};
```

## UI Component Patterns

### shadcn/ui Components (components/ui/)
- Use class-variance-authority (cva) for variant styling
- Forward refs for DOM integration
- Compound component patterns with Radix UI primitives

```typescript
// Button component pattern
const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: { default: "...", destructive: "..." },
      size: { default: "...", sm: "...", lg: "..." },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

### Material-UI Integration
- Use ThemeProvider for consistent theming
- Prefer sx prop over inline styles
- Dark/light theme support via useMediaQuery

## State Management Patterns

### React Hooks Only
- No external state management library
- Use useState for local component state
- Use useEffect for side effects and data fetching
- Use useCallback/useMemo for performance optimization

### Data Flow
```typescript
// Client functions handle API calls
export const getOpenTabs = async () => {
  return (await getClient()).getOpenTabs();
};

// Components fetch and manage state
const [openTabs, setOpenTabs] = useState<ITab[]>([]);

useEffect(() => {
  getOpenTabs().then(setOpenTabs);
}, []);
```

## Styling Guidelines

### Tailwind CSS
- Use utility classes for styling
- Custom components use cn() utility for class merging
- Responsive design with responsive prefixes

### CSS Modules
- Component-specific styles in `.module.css` files
- Use for complex layout or animation styles
- Import as `import styles from "./Component.module.css"`

### Material-UI Theming
- Custom theme with primary/secondary colors
- Dark mode support via system preference
- Consistent spacing and typography

## Development Workflow

### Before Committing
1. Run `yarn lint` to check for ESLint errors
2. Run `yarn build` to ensure TypeScript compilation succeeds
3. Test functionality in development mode

### Code Quality
- ESLint configuration enforces React hooks rules
- TypeScript strict mode catches type errors
- Prettier formatting (2 spaces, semicolons, trailing commas)

### File Organization
- Keep components focused and single-purpose
- Separate business logic from UI components
- Use proper TypeScript interfaces for all props
- Export interfaces for reuse in other components

## Backend Integration

### Supabase Client
- All database operations go through `/src/clients/`
- Use async/await patterns for API calls
- Handle authentication state in App component
- Real-time subscriptions for data updates

### Environment Variables
- Supabase configuration in environment variables
- No hardcoded API keys or secrets
- Use proper error handling for network requests