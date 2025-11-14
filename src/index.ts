import { groupTailwindClassesRule } from './infrastructure/eslint/groupTailwindClassesRule';

/**
 * ESLint Plugin for grouping Tailwind CSS classes
 */
const plugin = {
    rules: {
        'group-classes': groupTailwindClassesRule
    },
    configs: {
        recommended: {
            plugins: ['tailwind-grouping'],
            rules: {
                'tailwind-grouping/group-classes': 'warn'
            }
        }
    }
};

export = plugin;