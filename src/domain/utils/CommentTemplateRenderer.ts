/**
 * Variables available in comment templates
 */
export interface TemplateVariables {
    /**
     * The name of the class group (e.g., "Size", "Spacing")
     */
    groupName: string;

    /**
     * 1-based index of the group in the list
     */
    index: number;

    /**
     * Number of classes in the group
     */
    count: number;
}

/**
 * Renders a comment template by replacing variables with their actual values.
 *
 * Supported template variables:
 * - {groupName}: Name of the group
 * - {index}: 1-based position of the group
 * - {count}: Number of classes in the group
 *
 * @param template - Template string containing variables
 * @param variables - Object containing values for template variables
 * @returns Rendered comment string
 *
 * @example
 * renderCommentTemplate("// {groupName}", { groupName: "Size", index: 1, count: 2 })
 * // Returns: "// Size"
 *
 * @example
 * renderCommentTemplate("// {index}. {groupName} ({count})", { groupName: "Size", index: 1, count: 2 })
 * // Returns: "// 1. Size (2)"
 */
export function renderCommentTemplate(template: string, variables: TemplateVariables): string {
    return template
        .replace(/{groupName}/g, variables.groupName)
        .replace(/{index}/g, String(variables.index))
        .replace(/{count}/g, String(variables.count));
}