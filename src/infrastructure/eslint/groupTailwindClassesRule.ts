import type {Rule} from 'eslint';
import type {Literal, Node, Program} from 'estree';
import type {JSXAttribute} from 'estree-jsx';
import {TransformClassNameUseCase} from '../../application/use-cases/TransformClassNameUseCase';
import {ClassGroupingService} from '../../domain/services/ClassGroupingService';
import {DEFAULT_OPTIONS, RuleOptions, ruleOptionsSchema} from './RuleOptions';
import {ImportManager} from '../ast/ImportManager';
import {GlobMatcher} from '../ast/GlobMatcher';

/**
 * ESLint rule for grouping Tailwind classes
 */
export const groupTailwindClassesRule: Rule.RuleModule = {
    meta: {
        type: 'layout',
        docs: {
            description: 'Group Tailwind CSS classes into categories using clsx',
            category: 'Stylistic Issues',
            recommended: false,
            url: 'https://github.com/your-repo/eslint-plugin-tailwind-grouping'
        },
        fixable: 'code',
        schema: [ruleOptionsSchema],
        messages: {
            groupClasses: 'Tailwind classes should be grouped using {{utilityFunction}}',
            reorganizeClasses: 'Tailwind classes should be reorganized into proper groups'
        }
    },

    create(context: Rule.RuleContext): Rule.RuleListener {
        // Parse options
        const options: Required<RuleOptions> = {
            ...DEFAULT_OPTIONS,
            ...(context.options[0] as RuleOptions || {})
        };

        // Check if this file should be processed
        const filename = context.getFilename();
        if (options.include.length > 0 && !GlobMatcher.matchesAny(filename, options.include)) {
            return {}; // Skip this file
        }
        if (options.exclude.length > 0 && GlobMatcher.matchesAny(filename, options.exclude)) {
            return {}; // Skip this file
        }

        // Create services
        const groupingService = new ClassGroupingService(options.groupOrder, options.mapping);
        const transformUseCase = new TransformClassNameUseCase(groupingService);
        const importManager = new ImportManager(options.utilityFunction);

        // Track the program node for import management
        let programNode: Program | null = null;

        return {
            Program(node: Node) {
                programNode = node as Program;
            },

            JSXAttribute(node: Node) {
                const jsxAttr = node as JSXAttribute;

                // Check if this is a className attribute
                if (jsxAttr.name.type !== 'JSXIdentifier' || jsxAttr.name.name !== 'className') {
                    return;
                }

                // Handle static string values
                if (jsxAttr.value?.type === 'Literal' && typeof jsxAttr.value.value === 'string') {
                    handleStaticClassName(jsxAttr, jsxAttr.value);
                }

                // Handle JSX expressions with string literals
                if (jsxAttr.value?.type === 'JSXExpressionContainer' &&
                    jsxAttr.value.expression.type === 'Literal' &&
                    typeof jsxAttr.value.expression.value === 'string') {
                    handleStaticClassName(jsxAttr, jsxAttr.value.expression);
                }

                // Handle template literals (static only)
                if (jsxAttr.value?.type === 'JSXExpressionContainer' &&
                    jsxAttr.value.expression.type === 'TemplateLiteral' &&
                    jsxAttr.value.expression.expressions.length === 0 && // Only static templates
                    jsxAttr.value.expression.quasis.length === 1) {
                    const templateValue = jsxAttr.value.expression.quasis[0].value.cooked || '';
                    handleStaticClassNameFromTemplate(jsxAttr, templateValue);
                }

                // TODO: Handle existing clsx/cn calls for reorganization
                // This would involve parsing CallExpression nodes
            }
        };

        function handleStaticClassName(attrNode: JSXAttribute, literalNode: Literal) {
            const classNameString = String(literalNode.value);

            // Transform the className
            const result = transformUseCase.execute({
                classNameString,
                threshold: options.threshold
            });

            if (!result.shouldTransform) {
                return;
            }

            // Report and fix
            context.report({
                node: attrNode,
                messageId: 'groupClasses',
                data: {
                    utilityFunction: options.utilityFunction
                },
                fix(fixer) {
                    const fixes: Rule.Fix[] = [];

                    // Add import if needed
                    if (programNode && !importManager.isImported(programNode)) {
                        const importFix = importManager.createImportFixer(programNode)(fixer);
                        if (importFix) {
                            fixes.push(importFix);
                        }
                    }

                    // Replace className value
                    if (attrNode.value && attrNode.value.range && result.transformedString) {
                        const indentLevel = getIndentLevel(attrNode, context);
                        const transformedWithIndent = result.transformedString.replace(
                            /\n/g,
                            '\n' + ' '.repeat(indentLevel)
                        );

                        fixes.push(
                            fixer.replaceTextRange(
                                attrNode.value.range,
                                `{${transformedWithIndent}}`
                            )
                        );
                    }

                    return fixes;
                }
            });
        }

        function handleStaticClassNameFromTemplate(attrNode: JSXAttribute, classNameString: string) {
            // Transform the className
            const result = transformUseCase.execute({
                classNameString,
                threshold: options.threshold
            });

            if (!result.shouldTransform) {
                return;
            }

            // Report and fix
            context.report({
                node: attrNode,
                messageId: 'groupClasses',
                data: {
                    utilityFunction: options.utilityFunction
                },
                fix(fixer) {
                    const fixes: Rule.Fix[] = [];

                    // Add import if needed
                    if (programNode && !importManager.isImported(programNode)) {
                        const importFix = importManager.createImportFixer(programNode)(fixer);
                        if (importFix) {
                            fixes.push(importFix);
                        }
                    }

                    // Replace className value
                    if (attrNode.value && attrNode.value.range && result.transformedString) {
                        const indentLevel = getIndentLevel(attrNode, context);
                        const transformedWithIndent = result.transformedString.replace(
                            /\n/g,
                            '\n' + ' '.repeat(indentLevel)
                        );

                        fixes.push(
                            fixer.replaceTextRange(
                                attrNode.value.range,
                                `{${transformedWithIndent}}`
                            )
                        );
                    }

                    return fixes;
                }
            });
        }

        function getIndentLevel(node: Node, context: Rule.RuleContext): number {
            const sourceCode = context.getSourceCode();
            const token = sourceCode.getFirstToken(node);

            if (!token || !token.loc) {
                return 2;
            }

            // Get the column of the attribute
            return token.loc.start.column;
        }
    }
};