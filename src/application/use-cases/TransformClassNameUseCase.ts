import {TailwindClass} from '../../domain/value-objects/TailwindClass';
import {ClassGroupingService} from '../../domain/services/ClassGroupingService';
import {ClassGrouping} from '../../domain/entities/ClassGrouping';
import {ClassOrder, ClassSorter} from '../../infrastructure/sorting/ClassSorter';

export interface TransformClassNameInput {
    classNameString: string;
    threshold: number;
    showGroupNames?: boolean;
    order?: ClassOrder;
}

export interface TransformClassNameOutput {
    shouldTransform: boolean;
    originalString: string;
    transformedString?: string;
    grouping?: ClassGrouping;
}

/**
 * Use Case: Transform a className string into a grouped clsx expression
 * This is the main application service that orchestrates the transformation
 */
export class TransformClassNameUseCase {
    constructor(private readonly groupingService: ClassGroupingService) {
    }

    async execute(input: TransformClassNameInput): Promise<TransformClassNameOutput> {
        const {classNameString, threshold, showGroupNames = true, order} = input;

        // Parse the string into individual classes
        const classNames = this.parseClassNames(classNameString);

        if (classNames.length === 0) {
            return {
                shouldTransform: false,
                originalString: classNameString
            };
        }

        // Remove duplicates (keep first occurrence)
        const uniqueClassNames = this.removeDuplicates(classNames);

        // Convert to domain objects
        const tailwindClasses = uniqueClassNames.map(name => TailwindClass.create(name));

        // Group the classes
        const grouping = this.groupingService.groupClasses(tailwindClasses);

        // Check if threshold is met
        if (!grouping.meetsThreshold(threshold)) {
            return {
                shouldTransform: false,
                originalString: classNameString,
                grouping
            };
        }

        // Create sorter function if order is specified and not 'no-sort'
        const sorter = order && order !== 'no-sort'
            ? (classes: TailwindClass[]) => ClassSorter.sort(classes, order)
            : undefined;

        // Generate the transformed string
        const transformedString = await grouping.toClsxString(2, showGroupNames, sorter);

        return {
            shouldTransform: true,
            originalString: classNameString,
            transformedString,
            grouping
        };
    }

    /**
     * Parse a className string into individual class names
     * Handles multiple spaces and trims
     */
    private parseClassNames(classNameString: string): string[] {
        return classNameString
            .split(/\s+/)
            .map(name => name.trim())
            .filter(name => name.length > 0);
    }

    /**
     * Remove duplicate class names, keeping the first occurrence
     */
    private removeDuplicates(classNames: string[]): string[] {
        const seen = new Set<string>();
        const unique: string[] = [];

        for (const name of classNames) {
            if (!seen.has(name)) {
                seen.add(name);
                unique.push(name);
            }
        }

        return unique;
    }
}