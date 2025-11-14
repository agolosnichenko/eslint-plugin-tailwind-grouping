# ESLint Plugin: Tailwind Grouping

An ESLint plugin that automatically groups and organizes Tailwind CSS classes into semantic categories, improving
readability and maintainability of your React/JSX code.

## 📋 Table of Contents

- [Problem](#problem)
- [Solution](#solution)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Examples](#examples)
- [Development](#development)

## 🎯 Problem

Large Tailwind className strings are difficult to read and maintain:

```jsx
<select
    className="border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 dark:hover:bg-input/50 h-9 w-full min-w-0 appearance-none rounded-md border bg-transparent px-3 py-2 pr-9 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed"/>
```

## ✨ Solution

The plugin automatically transforms long className strings into organized, commented groups using `clsx`:

```jsx
<select
    className={clsx(
        // Size
        "h-9 w-full min-w-0",
        // Spacing
        "px-3 py-2 pr-9",
        // Border
        "border border-input outline-none rounded-md",
        // Background
        "bg-transparent dark:bg-input/30 dark:hover:bg-input/50 selection:bg-primary",
        // Text
        "text-sm selection:text-primary-foreground placeholder:text-muted-foreground",
        // Effects
        "appearance-none shadow-xs transition-[color,box-shadow]",
        // Others
        "disabled:pointer-events-none disabled:cursor-not-allowed"
    )}
/>
```

## 📦 Installation

```bash
npm install --save-dev eslint-plugin-tailwind-grouping
# or
yarn add -D eslint-plugin-tailwind-grouping
# or
pnpm add -D eslint-plugin-tailwind-grouping
```

## 🚀 Usage

### ESLint Configuration (Flat Config - ESLint 9+)

```javascript
// eslint.config.js
import tailwindGrouping from 'eslint-plugin-tailwind-grouping';

export default [
    {
        plugins: {
            'tailwind-grouping': tailwindGrouping
        },
        rules: {
            'tailwind-grouping/group-classes': ['warn', {
                threshold: 5,
                include: ['**/*.tsx', '**/*.jsx'],
                exclude: ['**/*.test.tsx']
            }]
        }
    }
];
```

### ESLint Configuration (Legacy)

```json
{
  "plugins": [
    "tailwind-grouping"
  ],
  "rules": {
    "tailwind-grouping/group-classes": [
      "warn",
      {
        "threshold": 5
      }
    ]
  }
}
```

### Using with Prettier

This plugin is compatible with Prettier. Make sure to run ESLint with `--fix` flag:

```bash
eslint --fix .
```

## ⚙️ Configuration

### Options

```typescript
{
    // Minimum number of classes required to trigger transformation
    // Default: 0
    threshold ? : number;

    // Glob patterns for files to include
    // Default: [] (all files)
    include ? : string[];

    // Glob patterns for files to exclude
    // Default: [] (no exclusions)
    exclude ? : string[];

    // Custom mapping of groups to class patterns
    // Default: DEFAULT_GROUP_MAPPING
    mapping ? : {
        [groupName: string
]:
    string[];
}
    ;

    // Custom order of groups
    // Default: ['Size', 'Layout', 'Spacing', 'Border', 'Background', 'Text', 'Effects', 'Others']
    groupOrder ? : string[];

    // Name of the utility function to use
    // Default: 'clsx'
    utilityFunction ? : string;
}
```

### Example: Custom Mapping

```javascript
{
    "tailwind-grouping/group-classes"
:
    ["warn", {
        "threshold": 3,
        "mapping": {
            "Size": ["w-*", "h-*", "min-w-*", "max-w-*"],
            "Colors": ["bg-*", "text-*", "border-*"],
            "Spacing": ["p-*", "m-*", "gap-*"],
            "Others": []
        },
        "groupOrder": ["Size", "Colors", "Spacing", "Others"]
    }]
}
```

### Example: Custom Utility Function

```javascript
{
    "tailwind-grouping/group-classes"
:
    ["warn", {
        "utilityFunction": "cn" // Use shadcn/ui's cn function
    }]
}
```

## 📚 Examples

### Before

```jsx
<div
    className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow">
    Content
</div>
```

### After (with threshold: 3)

```jsx
<div
    className={clsx(
        // Layout
        "flex items-center justify-between",
        // Spacing
        "p-4",
        // Border
        "border rounded-lg",
        // Background
        "bg-white",
        // Effects
        "shadow-md hover:shadow-lg transition-shadow"
    )}
>
    Content
</div>
```

### Handling Modifiers

The plugin preserves all Tailwind modifiers (responsive, state, dark mode, etc.):

```jsx
// Input
className = "md:flex lg:grid hover:bg-blue-500 dark:bg-gray-900"

// Output
className = {
    clsx(
    // Layout
    "md:flex lg:grid",
    // Background
    "hover:bg-blue-500 dark:bg-gray-900"
)
}
```

### Handling Arbitrary Values

Arbitrary values are properly grouped:

```jsx
// Input
className = "w-[500px] h-[calc(100vh-80px)] bg-[#ff0000]"

// Output
className = {
    clsx(
    // Size
    "w-[500px] h-[calc(100vh-80px)]",
    // Background
    "bg-[#ff0000]"
)
}
```

## 🧪 Development

### Setup

```bash
# Install dependencies
npm install

# Build the plugin
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint the code
npm run lint
```

### Running Tests

```bash
npm test
```

### Testing Locally

To test the plugin in a project before publishing:

```bash
# In the plugin directory
npm link

# In your project directory
npm link eslint-plugin-tailwind-grouping
```

### Design Principles

- **Immutability**: All domain objects are immutable
- **Single Responsibility**: Each class has one clear purpose
- **Dependency Injection**: Services receive dependencies via constructor
- **Testability**: Pure business logic separated from infrastructure
- **Type Safety**: Full TypeScript coverage with strict mode

## 🤝 Contributing

Contributions are welcome! Please ensure:

1. All tests pass (`npm test`)
2. Code follows the existing architecture
3. New features include tests
4. TypeScript types are properly defined

## 📄 License

MIT

## 🔗 Links

- [GitHub Repository](https://github.com/agolosnichenko/eslint-plugin-tailwind-grouping)
- [Issue Tracker](https://github.com/agolosnichenko/eslint-plugin-tailwind-grouping/issues)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [ESLint Documentation](https://eslint.org)