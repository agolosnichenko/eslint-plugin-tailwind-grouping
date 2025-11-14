import type { Rule } from 'eslint';
import type { Node, Program } from 'estree';

/**
 * Helper class for managing imports in the AST
 * Handles adding clsx import if it doesn't exist
 */
export class ImportManager {
    constructor(
        private readonly utilityFunction: string
    ) {}

    /**
     * Checks if the utility function is already imported
     */
    isImported(program: Program): boolean {
        for (const node of program.body) {
            if (node.type === 'ImportDeclaration') {
                // Check for named import: import { clsx } from 'clsx'
                if (node.specifiers) {
                    for (const specifier of node.specifiers) {
                        if (specifier.type === 'ImportSpecifier' &&
                            specifier.imported.type === 'Identifier' &&
                            specifier.imported.name === this.utilityFunction) {
                            return true;
                        }
                        // Check for default import: import clsx from 'clsx'
                        if (specifier.type === 'ImportDefaultSpecifier' &&
                            specifier.local.name === this.utilityFunction) {
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }

    /**
     * Generates the import statement to add
     */
    generateImportStatement(): string {
        return `import { ${this.utilityFunction} } from '${this.utilityFunction}';\n`;
    }

    /**
     * Finds the position to insert the import
     * Returns the node after which to insert (or null for beginning)
     */
    findInsertPosition(program: Program): {
        insertAfter?: Node;
        insertAtStart?: boolean;
    } {
        const firstImport = program.body.find(node => node.type === 'ImportDeclaration');

        if (firstImport) {
            // Find the last import in the file
            let lastImport = firstImport;
            for (const node of program.body) {
                if (node.type === 'ImportDeclaration') {
                    lastImport = node;
                } else {
                    break; // Stop at first non-import
                }
            }
            return { insertAfter: lastImport };
        }

        // No imports found, insert at the start
        return { insertAtStart: true };
    }

    /**
     * Creates a fixer to add the import statement
     */
    createImportFixer(program: Program): (fixer: Rule.RuleFixer) => Rule.Fix | null {
        return (fixer: Rule.RuleFixer) => {
            const importStatement = this.generateImportStatement();
            const position = this.findInsertPosition(program);

            if (position.insertAtStart) {
                return fixer.insertTextBeforeRange([0, 0], importStatement);
            }

            if (position.insertAfter && position.insertAfter.range) {
                return fixer.insertTextAfterRange(
                    position.insertAfter.range,
                    '\n' + importStatement.trimEnd()
                );
            }

            return null;
        };
    }
}