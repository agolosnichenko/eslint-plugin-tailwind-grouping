import { TailwindClass } from '../value-objects/TailwindClass';

/**
 * Entity representing a group of Tailwind classes
 * e.g., "Size" group containing "h-9", "w-full", "min-w-0"
 */
export class ClassGroup {
    constructor(
        public readonly name: string,
        public readonly classes: TailwindClass[]
    ) {
        if (!name || name.trim().length === 0) {
            throw new Error('ClassGroup name cannot be empty');
        }
    }

    /**
     * Creates an empty group
     */
    static empty(name: string): ClassGroup {
        return new ClassGroup(name, []);
    }

    /**
     * Adds a class to this group (returns new instance - immutable)
     */
    addClass(tailwindClass: TailwindClass): ClassGroup {
        return new ClassGroup(this.name, [...this.classes, tailwindClass]);
    }

    /**
     * Adds multiple classes to this group (returns new instance - immutable)
     */
    addClasses(tailwindClasses: TailwindClass[]): ClassGroup {
        return new ClassGroup(this.name, [...this.classes, ...tailwindClasses]);
    }

    /**
     * Checks if this group is empty
     */
    isEmpty(): boolean {
        return this.classes.length === 0;
    }

    /**
     * Returns the number of classes in this group
     */
    get size(): number {
        return this.classes.length;
    }

    /**
     * Converts the group to a formatted string for clsx
     * e.g., "h-9 w-full min-w-0"
     * @param sortedClasses - Optional pre-sorted array of classes to use instead of this.classes
     */
    toClassString(sortedClasses?: TailwindClass[]): string {
        const classesToUse = sortedClasses ?? this.classes;
        return classesToUse.map(c => c.toString()).join(' ');
    }
}