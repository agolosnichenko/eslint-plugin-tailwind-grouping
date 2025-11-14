import { GroupMapping, DEFAULT_GROUP_MAPPING, DEFAULT_GROUP_ORDER } from '../../config/defaults';

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
}

export const DEFAULT_OPTIONS: Required<RuleOptions> = {
    threshold: 0,
    include: [],
    exclude: [],
    mapping: DEFAULT_GROUP_MAPPING,
    groupOrder: [...DEFAULT_GROUP_ORDER],
    utilityFunction: 'clsx'
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
            items: { type: 'string' },
            description: 'Glob patterns for files to include'
        },
        exclude: {
            type: 'array',
            items: { type: 'string' },
            description: 'Glob patterns for files to exclude'
        },
        mapping: {
            type: 'object',
            additionalProperties: {
                type: 'array',
                items: { type: 'string' }
            },
            description: 'Custom mapping of groups to class patterns'
        },
        groupOrder: {
            type: 'array',
            items: { type: 'string' },
            description: 'Custom order of groups'
        },
        utilityFunction: {
            type: 'string',
            default: 'clsx',
            description: 'Name of the utility function to use'
        }
    },
    additionalProperties: false
};