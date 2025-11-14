import { TailwindClass } from '../value-objects/TailwindClass';
import { ClassGrouping } from '../entities/ClassGrouping';
import { GroupMapping } from '../../config/defaults';

/**
 * Domain Service responsible for grouping Tailwind classes
 * Contains the core business logic for class categorization
 */
export class ClassGroupingService {
    constructor(
        private readonly groupOrder: readonly string[],
        private readonly groupMapping: GroupMapping
    ) {}

    /**
     * Groups a collection of Tailwind classes according to the mapping
     */
    groupClasses(classes: TailwindClass[]): ClassGrouping {
        let grouping = ClassGrouping.createEmpty([...this.groupOrder]);

        for (const tailwindClass of classes) {
            const groupName = this.findGroupForClass(tailwindClass);
            grouping = grouping.addClassToGroup(groupName, tailwindClass);
        }

        return grouping;
    }

    /**
     * Finds the appropriate group for a given Tailwind class
     * Returns "Others" if no matching group is found
     */
    private findGroupForClass(tailwindClass: TailwindClass): string {
        for (const [groupName, patterns] of Object.entries(this.groupMapping)) {
            // Skip "Others" group during iteration - it's the fallback
            if (groupName === 'Others') {
                continue;
            }

            for (const pattern of patterns) {
                if (tailwindClass.matchesPattern(pattern)) {
                    return groupName;
                }
            }
        }

        // If no match found, return "Others"
        return 'Others';
    }

    /**
     * Validates that the mapping contains all groups from the order
     */
    static validate(groupOrder: readonly string[], groupMapping: GroupMapping): void {
        for (const groupName of groupOrder) {
            if (!(groupName in groupMapping)) {
                throw new Error(`Group "${groupName}" is in order but not in mapping`);
            }
        }
    }
}