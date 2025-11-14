import {ClassGroup} from './ClassGroup';
import {TailwindClass} from '../value-objects/TailwindClass';
import {renderCommentTemplate} from '../utils/CommentTemplateRenderer';

/**
 * Type for sorting function that takes classes and returns sorted classes
 * Can be async to support external sorting libraries
 */
export type ClassSorterFunction = (classes: TailwindClass[]) => Promise<TailwindClass[]> | TailwindClass[];

/**
 * Aggregate Root representing the complete grouping of Tailwind classes
 * Maintains the order of groups and ensures business rules
 */
export class ClassGrouping {
    constructor(public readonly groups: ClassGroup[]) {
    }

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
     * Formats the grouping as a clsx expression with optional comments
     * @param indentLevel - Number of spaces for indentation
     * @param showGroupNames - Whether to include group name comments
     * @param commentTemplate - Template string for comments (e.g., "// {groupName}", "/\u002A {index}. {groupName} \u002A/")
     * @param sorter - Optional sorting function to apply to classes in each group
     */
    async toClsxString(
        indentLevel: number = 2,
        showGroupNames: boolean = true,
        commentTemplate: string = '// {groupName}',
        sorter?: ClassSorterFunction,
    ): Promise<string> {
        const indent = ' '.repeat(indentLevel);
        const nonEmptyGroups = this.getNonEmptyGroups();

        if (nonEmptyGroups.length === 0) {
            return '""';
        }

        const lines: string[] = [];

        for (let index = 0; index < nonEmptyGroups.length; index++) {
            const group = nonEmptyGroups[index];

            // Apply sorting if sorter function is provided
            const sortedClasses = sorter ? await sorter(group.classes) : undefined;
            const classLine = `${indent}"${group.toClassString(sortedClasses)}"${index < nonEmptyGroups.length - 1 ? ',' : ''}`;

            if (showGroupNames) {
                // Render comment using template
                const comment = renderCommentTemplate(commentTemplate, {
                    groupName: group.name,
                    index: index + 1, // 1-based index
                    count: group.size
                });
                lines.push(`${indent}${comment}`);
                lines.push(classLine);
            } else {
                lines.push(classLine);
            }
        }

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