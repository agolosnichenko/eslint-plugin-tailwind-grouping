import {sortTailwindClasses} from '@herb-tools/tailwind-class-sorter';
import {TailwindClass} from '../../domain/value-objects/TailwindClass';

/**
 * Sorting order options for Tailwind classes within a group
 */
export type ClassOrder = 'no-sort' | 'asc' | 'desc' | 'official';

/**
 * Service for sorting Tailwind classes using different strategies
 * Located in infrastructure layer as it depends on external library
 */
export class ClassSorter {
    /**
     * Sorts an array of TailwindClass objects according to the specified order
     * @param classes - Array of TailwindClass objects to sort
     * @param order - Sorting strategy ('no-sort', 'asc', 'desc', 'official')
     * @returns Sorted array of TailwindClass objects
     */
    static async sort(
        classes: TailwindClass[],
        order: ClassOrder
    ): Promise<TailwindClass[]> {
        if (classes.length === 0) {
            return classes;
        }

        switch (order) {
            case 'no-sort':
                return classes;
            case 'asc':
                return this.sortAlphabetically(classes, 'asc');
            case 'desc':
                return this.sortAlphabetically(classes, 'desc');
            case 'official':
                return await this.sortUsingTailwindOfficial(classes);
            default:
                return classes;
        }
    }

    /**
     * Sorts classes alphabetically (case-insensitive)
     */
    private static sortAlphabetically(
        classes: TailwindClass[],
        direction: 'asc' | 'desc'
    ): TailwindClass[] {
        return [...classes].sort((a, b) => {
            const comparison = a.toString().localeCompare(b.toString(), 'en', {
                sensitivity: 'base'
            });
            return direction === 'asc' ? comparison : -comparison;
        });
    }

    /**
     * Sorts classes using Tailwind's official recommended order
     * Uses @herb-tools/tailwind-class-sorter which implements the same logic
     * as prettier-plugin-tailwindcss
     */
    private static async sortUsingTailwindOfficial(
        classes: TailwindClass[]
    ): Promise<TailwindClass[]> {
        try {
            // Convert TailwindClass objects to string
            const classString = classes.map(c => c.toString()).join(' ');

            // Sort using the official Tailwind ordering
            const sortedString = await sortTailwindClasses(classString);

            // Split back into individual class names
            const sortedNames = sortedString.split(/\s+/).filter(name => name.length > 0);

            // Map back to TailwindClass objects, preserving the original instances
            // Create a map for quick lookup
            const classMap = new Map(
                classes.map(cls => [cls.toString(), cls])
            );

            return sortedNames.map(name => classMap.get(name) as TailwindClass);
        } catch (error) {
            // If sorting fails, log error and return original order
            console.warn('Failed to sort classes using official Tailwind order:', error);
            return classes;
        }
    }
}