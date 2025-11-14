/**
 * Value Object representing a single Tailwind class
 * Immutable and contains all the information about a class including modifiers
 */
export class TailwindClass {
    private constructor(
        public readonly original: string,
        public readonly baseClass: string,
        public readonly modifiers: string[]
    ) {}

    static create(className: string): TailwindClass {
        const parts = className.split(':');

        if (parts.length === 1) {
            // No modifiers, e.g., "bg-blue-500"
            return new TailwindClass(className, className, []);
        }

        // Has modifiers, e.g., "dark:hover:bg-blue-500"
        const baseClass = parts[parts.length - 1];
        const modifiers = parts.slice(0, -1);

        return new TailwindClass(className, baseClass, modifiers);
    }

    /**
     * Returns the class without arbitrary values for pattern matching
     * e.g., "w-[500px]" -> "w-*"
     */
    getPatternForMatching(): string {
        // Check if this is an arbitrary value (contains [...])
        const arbitraryMatch = this.baseClass.match(/^([a-z-]+?)-\[.+\]$/);
        if (arbitraryMatch) {
            return `${arbitraryMatch[1]}-*`;
        }

        return this.baseClass;
    }

    /**
     * Checks if this class matches a given pattern
     * Supports wildcards like "w-*", "bg-*"
     */
    matchesPattern(pattern: string): boolean {
        if (pattern.endsWith('-*')) {
            const prefix = pattern.slice(0, -2);
            const classToMatch = this.getPatternForMatching();
            return classToMatch.startsWith(prefix + '-') || classToMatch === prefix;
        }

        return this.baseClass === pattern || this.getPatternForMatching() === pattern;
    }

    toString(): string {
        return this.original;
    }

    equals(other: TailwindClass): boolean {
        return this.original === other.original;
    }
}