# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An ESLint plugin that automatically groups and organizes Tailwind CSS classes into semantic categories using `clsx` or similar utility functions. The plugin transforms long, unreadable className strings into organized, commented groups.

Example transformation:
```jsx
// Before
<div className="w-full h-9 px-3 py-2 border border-input rounded-md bg-transparent text-sm shadow-xs" />

// After
<div className={clsx(
  // Size
  "w-full h-9",
  // Spacing
  "px-3 py-2",
  // Border
  "border border-input rounded-md",
  // Background
  "bg-transparent",
  // Text
  "text-sm",
  // Effects
  "shadow-xs"
)} />
```

## Development Commands

```bash
# Install dependencies
pnpm install

# Build the plugin (TypeScript compilation)
pnpm run build

# Watch mode for development
pnpm run watch

# Run tests
pnpm test

# Run tests in watch mode
pnpm run test:watch

# Lint the code
pnpm run lint
```

## Architecture: Clean Architecture + DDD

This codebase follows **Clean Architecture** and **Domain-Driven Design** principles with strict layer separation:

### Layer Structure

```
Domain Layer (Pure Business Logic)
  ├─ value-objects/     → TailwindClass (immutable, self-validating)
  ├─ entities/          → ClassGroup, ClassGrouping (aggregate root)
  └─ services/          → ClassGroupingService (stateless business logic)
       ↑
Application Layer (Use Cases)
  └─ use-cases/         → TransformClassNameUseCase (orchestration)
       ↑
Infrastructure Layer (External Concerns)
  ├─ eslint/            → groupTailwindClassesRule, RuleOptions
  └─ ast/               → ImportManager, GlobMatcher
```

**Critical Rule**: Dependencies flow inward only. Domain layer has ZERO external dependencies.

### Key Architectural Concepts

1. **Value Objects** (`TailwindClass`)
   - Immutable representations of Tailwind classes
   - Parse modifiers (e.g., `dark:hover:bg-blue-500` → modifiers: `['dark', 'hover']`, baseClass: `bg-blue-500`)
   - Handle arbitrary values (e.g., `w-[500px]`)

2. **Aggregate Root** (`ClassGrouping`)
   - Contains all class groups
   - Enforces business rules (threshold checking, group ordering)
   - Provides transformation methods (`toClsxString()`)
   - Builder-like immutable API

3. **Domain Service** (`ClassGroupingService`)
   - Stateless grouping logic
   - Uses pattern matching to categorize classes
   - Configured with custom mappings and group order

4. **Use Case** (`TransformClassNameUseCase`)
   - Single responsibility: orchestrate the transformation
   - Input: className string + threshold
   - Output: shouldTransform flag + transformed string

### Data Flow

```
ESLint Rule → TransformClassNameUseCase → ClassGroupingService
                                              ↓
                                         TailwindClass (parse)
                                              ↓
                                         ClassGrouping (build)
                                              ↓
                                         clsx string output
```

## Configuration System

Default configuration is in `src/config/defaults.ts`:

- **DEFAULT_GROUP_ORDER**: 8 semantic groups (Size, Layout, Spacing, Border, Background, Text, Effects, Others)
- **DEFAULT_GROUP_MAPPING**: Pattern-based mapping using wildcards (e.g., `"w-*"`, `"bg-*"`)

Users can override via ESLint config:
```javascript
{
  threshold: 5,              // Min classes to trigger transformation
  include: ['**/*.tsx'],     // Glob patterns for files to process
  exclude: ['**/*.test.tsx'],
  mapping: { /* custom */ }, // Custom group patterns
  groupOrder: [/* custom */],
  utilityFunction: 'clsx'    // Or 'cn' for shadcn/ui
}
```

## Key Implementation Details

### Pattern Matching
- Wildcard patterns use `*` (e.g., `"w-*"` matches `w-full`, `w-[500px]`, `w-1/2`)
- Modifiers are stripped before matching (e.g., `dark:bg-blue-500` matches `"bg-*"`)
- Unknown classes fall into "Others" group

### Import Management
- `ImportManager` auto-adds `import clsx from 'clsx'` when needed
- Checks existing imports to avoid duplicates
- Supports custom utility functions (e.g., `cn` from shadcn/ui)

### ESLint Integration
- Rule type: `'layout'` with `fixable: 'code'`
- Processes `JSXAttribute` nodes with `className` attribute
- Handles: string literals, JSX expressions, template literals (static only)
- Preserves indentation based on attribute position
- TODO (line 87-88): Handle reorganization of existing clsx/cn calls

### Immutability Pattern
All domain objects are immutable:
```typescript
// Wrong
group.addClass(class);

// Correct
const newGroup = group.addClass(class);
```

## Testing Strategy

Tests should follow the three-layer approach:

1. **Unit Tests (Domain)**: Test pure business logic
   - TailwindClass parsing
   - ClassGroup operations
   - Pattern matching in ClassGroupingService

2. **Integration Tests (Application)**: Test use case orchestration
   - TransformClassNameUseCase with real services
   - Threshold logic
   - End-to-end transformation

3. **E2E Tests (Infrastructure)**: Test ESLint rule
   - Use ESLint's RuleTester
   - Test autofixes
   - Test file inclusion/exclusion

## Design Principles

- **Immutability**: All domain objects return new instances
- **Single Responsibility**: Each class has one clear purpose
- **Dependency Injection**: Services receive dependencies via constructor
- **Type Safety**: Strict TypeScript mode enabled
- **Pure Functions**: Domain logic has no side effects

## Common Patterns

### Adding a New Group
1. Add to `DEFAULT_GROUP_ORDER` in `src/config/defaults.ts`
2. Add patterns to `DEFAULT_GROUP_MAPPING`
3. Tests automatically cover new groups via use case tests

### Modifying Transformation Logic
1. Change domain logic in `ClassGrouping` or `ClassGroupingService`
2. Update `TransformClassNameUseCase` if orchestration changes
3. ESLint rule automatically uses updated logic (no changes needed)

### Supporting New Utility Functions
1. User configures `utilityFunction: 'myUtil'` in ESLint config
2. `ImportManager` handles the import automatically
3. `ClassGrouping.toClsxString()` method name stays generic (doesn't change)

## Project Metadata

- **Package Manager**: pnpm (note `pnpm-workspace.yaml`)
- **TypeScript**: Strict mode with all safety flags enabled
- **Node Version**: >= 14.0.0
- **ESLint Support**: >= 7.0.0
- **Build Output**: `dist/` directory (CommonJS)
- **Entry Point**: `src/index.ts` exports plugin with rules and configs