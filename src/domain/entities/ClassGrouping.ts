import {ClassGroup} from './ClassGroup';

/**
 * Aggregate Root representing the complete grouping of Tailwind classes
 * Maintains the order of groups and ensures business rules
 */
export class ClassGrouping {
    constructor(public readonly groups: ClassGroup[]) {}

    /**
     * Creates an empty grouping with predefined group names
     */
    static createEmpty(groupNames: string[]): ClassGrouping {
        const groups = groupNames.map(name => ClassGroup.empty(name));
        return new ClassGrouping(groups);
    }

    /**
     * Adds a class to the appropriate group
     */
    addClassToGroup(groupName: string, tailwindClass: import('../value-objects/TailwindClass').TailwindClass): ClassGrouping {
        const groups = this.groups.map(group => {
            if (group.name === groupName) {
                return group.addClass(tailwindClass);
            }
            return group;
        });

        return new ClassGrouping(groups);
    }

    /**
     * Returns all non-empty groups
     */
    getNonEmptyGroups(): ClassGroup[] {
        return this.groups.filter(group => !group.isEmpty());
    }

    /**
     * Returns total number of classes across all groups
     */
    getTotalClassCount(): number {
        return this.groups.reduce((sum, group) => sum + group.size, 0);
    }

    /**
     * Checks if the grouping meets the threshold requirement
     */
    meetsThreshold(threshold: number): boolean {
        return this.getTotalClassCount() >= threshold;
    }

    /**
     * Formats the grouping as a clsx expression with comments
     */
    toClsxString(indentLevel: number = 2): string {
        const indent = ' '.repeat(indentLevel);
        const nonEmptyGroups = this.getNonEmptyGroups();

        if (nonEmptyGroups.length === 0) {
            return '""';
        }

        const lines = nonEmptyGroups.flatMap((group, index) => {
            return [
                `${indent}// ${group.name}`,
                `${indent}"${group.toClassString()}"${index < nonEmptyGroups.length - 1 ? ',' : ''}`
            ];
        });

        return `clsx(\n${lines.join('\n')}\n${' '.repeat(indentLevel - 2)})`;
    }

    /**
     * Returns all classes as a single string (for comparison)
     */
    toFlatString(): string {
        return this.groups
            .flatMap(group => group.classes)
            .map(c => c.toString())
            .join(' ');
    }
}