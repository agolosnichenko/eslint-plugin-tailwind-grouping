# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-11-14

### Added
- New `showGroupNames` configuration option to control whether group name comments are included in the output
  - Default value: `true` (maintains backward compatibility)
  - When set to `false`, generates grouped output without comment markers
  - Useful for users who prefer cleaner output or have their own commenting strategy
- New `order` configuration option to control sorting of classes within each group
  - `"no-sort"` (default): Preserve original order of classes
  - `"asc"`: Sort classes alphabetically A-Z within each group
  - `"desc"`: Sort classes alphabetically Z-A within each group
  - `"official"`: Use Tailwind's official class ordering (powered by @herb-tools/tailwind-class-sorter)
- Automatic duplicate class removal - duplicates are now automatically removed, keeping only the first occurrence

### Changed
- `TransformClassNameUseCase.execute()` is now async to support external sorting libraries
- `ClassGrouping.toClsxString()` is now async to accommodate sorting operations

### Dependencies
- Added `@herb-tools/tailwind-class-sorter` for official Tailwind class ordering
- Added `tailwindcss` v3 as dependency (required by class sorter)

## [1.0.0] - 2025-11-14

### Added
- Initial release of eslint-plugin-tailwind-grouping
- Core rule `group-classes` for grouping Tailwind CSS classes
- Auto-fix capability with automatic clsx import
- Configurable threshold for triggering transformation
- Include/exclude glob patterns for file filtering
- Customizable group mappings and order
- Support for:
    - Static className strings
    - Static template literals
    - Tailwind modifiers (responsive, state, dark mode, etc.)
    - Arbitrary values (e.g., `w-[500px]`)
- Default group categories:
    - Size
    - Layout
    - Spacing
    - Border
    - Background
    - Text
    - Effects
    - Others
- Clean Architecture implementation with DDD principles
- Comprehensive test suite
- TypeScript support with full type definitions

### Documentation
- Comprehensive README with examples
- Architecture documentation
- Configuration guide
- Contributing guidelines

## [Unreleased]

### Planned Features
- Support for reorganizing existing clsx/cn calls
- Support for conditional className expressions
- Integration with Tailwind CSS IntelliSense
- VS Code extension
- Custom comment templates
- Performance optimizations for large files