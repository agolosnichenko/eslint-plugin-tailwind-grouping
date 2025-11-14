# Architecture Documentation

## Overview

This ESLint plugin follows **Clean Architecture** principles and **Domain-Driven Design** (DDD) patterns to ensure maintainability, testability, and extensibility.

## Architectural Layers

```
┌────────────────────────────────────────────────────────────┐
│                     Infrastructure Layer                   │
│  (ESLint Integration, AST Manipulation, File System)       │
│                                                            │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  ESLint Rule     │  │   ImportManager  │                │
│  │  Implementation  │  │   GlobMatcher    │                │
│  └──────────────────┘  └──────────────────┘                │
└───────────────────────────┬────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│                     Application Layer                      │
│             (Use Cases, Application Services)              │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │       TransformClassNameUseCase                      │  │
│  │  - Orchestrates the transformation                   │  │
│  │  - Validates inputs                                  │  │
│  │  - Returns structured outputs                        │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────┬────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│                       Domain Layer                         │
│           (Pure Business Logic, No Dependencies)           │
│                                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Value Objects                          │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │          TailwindClass                       │   │   │
│  │  │  - Immutable representation of a class       │   │   │
│  │  │  - Handles modifiers and patterns            │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                 Entities                            │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │            ClassGroup                        │   │   │
│  │  │  - Named collection of classes               │   │   │
│  │  │  - Immutable operations                      │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │          ClassGrouping (Aggregate)           │   │   │
│  │  │  - Complete grouping of classes              │   │   │
│  │  │  - Enforces business rules                   │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Domain Services                        │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │      ClassGroupingService                    │   │   │
│  │  │  - Groups classes by patterns                │   │   │
│  │  │  - Applies business logic                    │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

## Domain-Driven Design Concepts

### Value Objects

**TailwindClass** is an immutable value object that represents a single Tailwind CSS class.

```typescript
// Examples of TailwindClass creation
TailwindClass.create("bg-blue-500")
  // → { original: "bg-blue-500", baseClass: "bg-blue-500", modifiers: [] }

TailwindClass.create("dark:hover:bg-blue-500")
  // → { original: "dark:hover:bg-blue-500", baseClass: "bg-blue-500", modifiers: ["dark", "hover"] }

TailwindClass.create("w-[500px]")
  // → { original: "w-[500px]", baseClass: "w-[500px]", modifiers: [] }
```

**Key Characteristics:**
- Immutable
- Self-validating
- Can be compared by value
- Contains logic for pattern matching

### Entities

**ClassGroup** is an entity that represents a named group of Tailwind classes.

```typescript
const sizeGroup = ClassGroup.empty("Size")
  .addClass(TailwindClass.create("w-full"))
  .addClass(TailwindClass.create("h-9"));

console.log(sizeGroup.toClassString());
// → "w-full h-9"
```

**Key Characteristics:**
- Has identity (name)
- Immutable (returns new instances)
- Contains business logic for operations

### Aggregate Root

**ClassGrouping** is the aggregate root that contains all class groups and maintains consistency.

```typescript
const grouping = ClassGrouping.createEmpty([
  "Size", "Layout", "Spacing", "Border", 
  "Background", "Text", "Effects", "Others"
]);

// Add classes to groups
let updatedGrouping = grouping
  .addClassToGroup("Size", TailwindClass.create("w-full"))
  .addClassToGroup("Size", TailwindClass.create("h-9"));

// Check threshold
if (updatedGrouping.meetsThreshold(5)) {
  const clsxString = updatedGrouping.toClsxString();
}
```

**Key Characteristics:**
- Controls access to internal entities
- Enforces invariants
- Provides a clear boundary for transactions

### Domain Services

**ClassGroupingService** contains business logic that doesn't naturally fit into entities or value objects.

```typescript
const service = new ClassGroupingService(
  DEFAULT_GROUP_ORDER,
  DEFAULT_GROUP_MAPPING
);

const classes = [
  TailwindClass.create("w-full"),
  TailwindClass.create("bg-blue-500"),
  TailwindClass.create("p-4")
];

const grouping = service.groupClasses(classes);
// → Classes are now organized into appropriate groups
```

**Key Characteristics:**
- Stateless
- Operates on domain objects
- Contains pure business logic

## Dependency Flow

The dependency rule is strictly enforced:

```
Infrastructure Layer (depends on) → Application Layer
Application Layer   (depends on) → Domain Layer
Domain Layer        (depends on) → Nothing (pure logic)
```

This means:
- **Domain Layer** has no dependencies on external frameworks or libraries
- **Application Layer** orchestrates domain objects but doesn't contain business logic
- **Infrastructure Layer** handles technical concerns (ESLint, AST, file system)

## Key Design Patterns

### 1. Repository Pattern (Implicit)

While we don't have traditional data persistence, the configuration management acts as a repository:

```typescript
// DefaultGroupMapping acts as a repository of group definitions
const mapping = DEFAULT_GROUP_MAPPING;
```

### 2. Strategy Pattern

The grouping logic can be swapped by providing different mappings:

```typescript
// Different strategies for grouping
const customMapping = { /* custom strategy */ };
const service = new ClassGroupingService(groupOrder, customMapping);
```

### 3. Builder Pattern

ClassGrouping uses a builder-like API for immutable construction:

```typescript
const grouping = ClassGrouping.createEmpty(groups)
  .addClassToGroup("Size", class1)
  .addClassToGroup("Size", class2)
  .addClassToGroup("Layout", class3);
```

### 4. Factory Pattern

TailwindClass uses a factory method for creation:

```typescript
const tailwindClass = TailwindClass.create("dark:bg-blue-500");
```

### 5. Command Pattern

The TransformClassNameUseCase follows the command pattern:

```typescript
interface TransformClassNameInput {
  classNameString: string;
  threshold: number;
}

const result = useCase.execute(input);
```

## Testing Strategy

### Unit Tests (Domain Layer)

Test business logic in isolation:

```typescript
describe('TailwindClass', () => {
  it('should parse modifiers correctly', () => {
    const cls = TailwindClass.create('dark:hover:bg-blue-500');
    expect(cls.modifiers).toEqual(['dark', 'hover']);
  });
});
```

### Integration Tests (Application Layer)

Test use cases with real domain services:

```typescript
describe('TransformClassNameUseCase', () => {
  it('should transform classes when threshold is met', () => {
    const result = useCase.execute({
      classNameString: 'w-full h-9 bg-blue p-4',
      threshold: 3
    });
    expect(result.shouldTransform).toBe(true);
  });
});
```

### End-to-End Tests (Infrastructure Layer)

Test the ESLint rule with real code:

```typescript
const ruleTester = new RuleTester();
ruleTester.run('group-classes', rule, {
  valid: [/* ... */],
  invalid: [/* ... */]
});
```

## Benefits of This Architecture

### 1. Testability
- Pure domain logic can be tested without ESLint
- No mocking required for business logic tests
- Fast test execution

### 2. Maintainability
- Clear separation of concerns
- Changes to ESLint API don't affect business logic
- Easy to understand and modify

### 3. Extensibility
- New grouping strategies can be added easily
- Support for other CSS frameworks possible
- Can add new output formats without changing core logic

### 4. Flexibility
- Business logic can be reused in other contexts
- Easy to add new features
- Configuration changes don't require code changes

### 5. Type Safety
- Full TypeScript coverage
- Strong typing throughout all layers
- Compile-time error detection

## Future Enhancements

The architecture supports these potential features:

1. **Multiple Output Formats**
    - Add a new formatter in the application layer
    - No changes to domain logic required

2. **Different CSS Frameworks**
    - Create new mapping configurations
    - Reuse domain layer completely

3. **Custom Sorting**
    - Add new domain service for sorting
    - Inject into use case

4. **Caching**
    - Add caching in infrastructure layer
    - No changes to business logic

5. **VS Code Extension**
    - Reuse application and domain layers
    - Only change infrastructure layer

## Conclusion

This architecture ensures that the plugin is:
- **Robust**: Changes in one layer don't affect others
- **Testable**: Each layer can be tested independently
- **Maintainable**: Clear structure makes changes easier
- **Extensible**: New features can be added without breaking existing code

The separation of concerns and dependency management make this a professional, enterprise-grade implementation suitable for large-scale projects.