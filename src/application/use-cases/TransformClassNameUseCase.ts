import { TailwindClass } from '../../domain/value-objects/TailwindClass';
import { ClassGroupingService } from '../../domain/services/ClassGroupingService';
import { ClassGrouping } from '../../domain/entities/ClassGrouping';

export interface TransformClassNameInput {
    classNameString: string;
    threshold: number;
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
    constructor(private readonly groupingService: ClassGroupingService) {}

    execute(input: TransformClassNameInput): TransformClassNameOutput {
        const { classNameString, threshold } = input;

        // Parse the string into individual classes
        const classNames = this.parseClassNames(classNameString);

        if (classNames.length === 0) {
            return {
                shouldTransform: false,
                originalString: classNameString
            };
        }

        // Convert to domain objects
        const tailwindClasses = classNames.map(name => TailwindClass.create(name));

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

        // Generate the transformed string
        const transformedString = grouping.toClsxString();

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
}