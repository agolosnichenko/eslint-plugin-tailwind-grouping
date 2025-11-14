import {
    GroupMapping,
    DEFAULT_GROUP_MAPPING,
    DEFAULT_GROUP_ORDER,
    DEFAULT_COMMENT_TEMPLATE,
    CommentTemplatePreset
} from '../../config/defaults';
import {ClassOrder} from '../sorting/ClassSorter';

export interface RuleOptions {
    /**
     * Minimum number of classes required to trigger transformation
     * @default 0
     */
    threshold?: number;

    /**
     * Glob patterns for files to include
     * @default undefined (all files)
     */
    include?: string[];

    /**
     * Glob patterns for files to exclude
     * @default undefined (no exclusions)
     */
    exclude?: string[];

    /**
     * Custom mapping of groups to class patterns
     * @default DEFAULT_GROUP_MAPPING
     */
    mapping?: GroupMapping;

    /**
     * Custom order of groups
     * @default DEFAULT_GROUP_ORDER
     */
    groupOrder?: string[];

    /**
     * Name of the utility function to use
     * @default "clsx"
     */
    utilityFunction?: string;

    /**
     * Whether to include group name comments in the output
     * @default true
     */
    showGroupNames?: boolean;

    /**
     * Comment template for group names.
     * Can be a preset name ('line', 'block', 'jsdoc', 'bracket', 'numbered', 'verbose')
     * or a custom template string with variables:
     * - {groupName}: Name of the group
     * - {index}: 1-based position of the group
     * - {count}: Number of classes in the group
     * @default "// {groupName}"
     * @example "// {groupName}" → "// Size"
     * @example "/* {groupName} *\/" → "/* Size *\/"
     * @example "// {index}. {groupName} ({count})" → "// 1. Size (2)"
     */
    commentTemplate?: string | CommentTemplatePreset;

    /**
     * Sorting order for classes within each group
     * @default "no-sort"
     */
    order?: ClassOrder;
}

export const DEFAULT_OPTIONS: Required<RuleOptions> = {
    threshold: 0,
    include: [],
    exclude: [],
    mapping: DEFAULT_GROUP_MAPPING,
    groupOrder: [...DEFAULT_GROUP_ORDER],
    utilityFunction: 'clsx',
    showGroupNames: true,
    commentTemplate: DEFAULT_COMMENT_TEMPLATE,
    order: 'no-sort'
};

/**
 * JSON Schema for ESLint rule configuration
 */
export const ruleOptionsSchema = {
    type: 'object',
    properties: {
        threshold: {
            type: 'number',
            minimum: 0,
            default: 0,
            description: 'Minimum number of classes required to trigger transformation'
        },
        include: {
            type: 'array',
            items: {type: 'string'},
            description: 'Glob patterns for files to include'
        },
        exclude: {
            type: 'array',
            items: {type: 'string'},
            description: 'Glob patterns for files to exclude'
        },
        mapping: {
            type: 'object',
            additionalProperties: {
                type: 'array',
                items: {type: 'string'}
            },
            description: 'Custom mapping of groups to class patterns'
        },
        groupOrder: {
            type: 'array',
            items: {type: 'string'},
            description: 'Custom order of groups'
        },
        utilityFunction: {
            type: 'string',
            default: 'clsx',
            description: 'Name of the utility function to use'
        },
        showGroupNames: {
            type: 'boolean',
            default: true,
            description: 'Whether to include group name comments in the output'
        },
        commentTemplate: {
            type: 'string',
            default: '// {groupName}',
            description: 'Comment template for group names. Can be a preset (line, block, jsdoc, bracket, numbered, verbose) or a custom template with variables: {groupName}, {index}, {count}'
        },
        order: {
            type: 'string',
            enum: ['no-sort', 'asc', 'desc', 'official'],
            default: 'no-sort',
            description: 'Sorting order for classes within each group'
        }
    },
    additionalProperties: false
};