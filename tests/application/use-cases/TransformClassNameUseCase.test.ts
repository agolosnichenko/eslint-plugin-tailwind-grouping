import {TransformClassNameUseCase} from '../../../src/application/use-cases/TransformClassNameUseCase';
import {ClassGroupingService} from '../../../src/domain/services/ClassGroupingService';
import {DEFAULT_GROUP_ORDER, DEFAULT_GROUP_MAPPING} from '../../../src/config/defaults';

describe('TransformClassNameUseCase', () => {
    let useCase: TransformClassNameUseCase;
    let groupingService: ClassGroupingService;

    beforeEach(() => {
        groupingService = new ClassGroupingService(DEFAULT_GROUP_ORDER, DEFAULT_GROUP_MAPPING);
        useCase = new TransformClassNameUseCase(groupingService);
    });

    describe('execute', () => {
        it('should not transform when below threshold', async () => {
            const result = await useCase.execute({
                classNameString: 'bg-blue-500 text-white',
                threshold: 5
            });

            expect(result.shouldTransform).toBe(false);
            expect(result.originalString).toBe('bg-blue-500 text-white');
        });

        it('should transform when meeting threshold', async () => {
            const result = await useCase.execute({
                classNameString: 'h-9 w-full px-3 py-2 border rounded-md bg-transparent',
                threshold: 5
            });

            expect(result.shouldTransform).toBe(true);
            expect(result.transformedString).toBeDefined();
            expect(result.transformedString).toContain('clsx(');
            expect(result.transformedString).toContain('// Size');
            expect(result.transformedString).toContain('// Spacing');
            expect(result.transformedString).toContain('// Border');
            expect(result.transformedString).toContain('// Background');
        });

        it('should transform with threshold 0', async () => {
            const result = await useCase.execute({
                classNameString: 'bg-blue-500',
                threshold: 0
            });

            expect(result.shouldTransform).toBe(true);
        });

        it('should handle empty string', async () => {
            const result = await useCase.execute({
                classNameString: '',
                threshold: 0
            });

            expect(result.shouldTransform).toBe(false);
        });

        it('should handle multiple spaces', async () => {
            const result = await useCase.execute({
                classNameString: 'bg-blue-500   text-white    p-4',
                threshold: 0
            });

            expect(result.shouldTransform).toBe(true);
            expect(result.grouping?.getTotalClassCount()).toBe(3);
        });

        it('should produce correct clsx format', async () => {
            const result = await useCase.execute({
                classNameString: 'h-9 w-full px-3 border bg-transparent',
                threshold: 0
            });

            expect(result.transformedString).toMatch(/clsx\(/);
            expect(result.transformedString).toMatch(/\/\/ Size/);
            expect(result.transformedString).toMatch(/"h-9 w-full"/);
            expect(result.transformedString).toMatch(/\/\/ Spacing/);
            expect(result.transformedString).toMatch(/"px-3"/);
        });

        it('should handle real-world example from the spec', async () => {
            const result = await useCase.execute({
                classNameString: 'border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 dark:hover:bg-input/50 h-9 w-full min-w-0 appearance-none rounded-md border bg-transparent px-3 py-2 pr-9 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed',
                threshold: 0
            });

            expect(result.shouldTransform).toBe(true);
            expect(result.transformedString).toContain('// Size');
            expect(result.transformedString).toContain('// Spacing');
            expect(result.transformedString).toContain('// Border');
            expect(result.transformedString).toContain('// Background');
            expect(result.transformedString).toContain('// Text');
            expect(result.transformedString).toContain('// Effects');

            // Verify modifiers are preserved
            expect(result.transformedString).toContain('dark:bg-input/30');
            expect(result.transformedString).toContain('placeholder:text-muted-foreground');
            expect(result.transformedString).toContain('disabled:pointer-events-none');
        });

        it('should transform without group name comments when showGroupNames is false', async () => {
            const result = await useCase.execute({
                classNameString: 'h-9 w-full px-3 py-2 border rounded-md bg-transparent',
                threshold: 0,
                showGroupNames: false
            });

            expect(result.shouldTransform).toBe(true);
            expect(result.transformedString).toBeDefined();
            expect(result.transformedString).toContain('clsx(');

            // Should NOT contain comment markers
            expect(result.transformedString).not.toContain('// Size');
            expect(result.transformedString).not.toContain('// Spacing');
            expect(result.transformedString).not.toContain('// Border');
            expect(result.transformedString).not.toContain('// Background');

            // Should still contain the classes
            expect(result.transformedString).toContain('"h-9 w-full"');
            expect(result.transformedString).toContain('"px-3 py-2"');
            expect(result.transformedString).toContain('"border rounded-md"');
            expect(result.transformedString).toContain('"bg-transparent"');
        });

        it('should transform with group name comments when showGroupNames is true', async () => {
            const result = await useCase.execute({
                classNameString: 'h-9 w-full px-3 border bg-transparent',
                threshold: 0,
                showGroupNames: true
            });

            expect(result.shouldTransform).toBe(true);
            expect(result.transformedString).toBeDefined();
            expect(result.transformedString).toContain('clsx(');

            // Should contain comment markers
            expect(result.transformedString).toContain('// Size');
            expect(result.transformedString).toContain('// Spacing');
            expect(result.transformedString).toContain('// Border');
            expect(result.transformedString).toContain('// Background');
        });

        it('should use default showGroupNames=true when not specified', async () => {
            const result = await useCase.execute({
                classNameString: 'h-9 px-3 bg-transparent',
                threshold: 0
            });

            expect(result.shouldTransform).toBe(true);
            expect(result.transformedString).toContain('// Size');
            expect(result.transformedString).toContain('// Spacing');
            expect(result.transformedString).toContain('// Background');
        });

        describe('duplicate removal', () => {
            it('should remove duplicate classes', async () => {
                const result = await useCase.execute({
                    classNameString: 'bg-blue-500 text-white bg-blue-500 p-4',
                    threshold: 0
                });

                expect(result.shouldTransform).toBe(true);
                expect(result.grouping?.getTotalClassCount()).toBe(3);
                // bg-blue-500 should only appear once
                const matches = result.transformedString?.match(/bg-blue-500/g);
                expect(matches?.length).toBe(1);
            });
        });

        describe('comment templates', () => {
            it('should use default comment template when not specified', async () => {
                const result = await useCase.execute({
                    classNameString: 'w-full px-3 bg-transparent',
                    threshold: 0
                });

                expect(result.shouldTransform).toBe(true);
                expect(result.transformedString).toContain('// Size');
                expect(result.transformedString).toContain('// Spacing');
                expect(result.transformedString).toContain('// Background');
            });

            it('should use custom comment template with groupName variable', async () => {
                const result = await useCase.execute({
                    classNameString: 'w-full px-3 bg-transparent',
                    threshold: 0,
                    commentTemplate: '/* {groupName} */'
                });

                expect(result.shouldTransform).toBe(true);
                expect(result.transformedString).toContain('/* Size */');
                expect(result.transformedString).toContain('/* Spacing */');
                expect(result.transformedString).toContain('/* Background */');
            });

            it('should use custom comment template with index variable', async () => {
                const result = await useCase.execute({
                    classNameString: 'w-full px-3 bg-transparent',
                    threshold: 0,
                    commentTemplate: '// {index}. {groupName}'
                });

                expect(result.shouldTransform).toBe(true);
                expect(result.transformedString).toContain('// 1. Size');
                expect(result.transformedString).toContain('// 2. Spacing');
                expect(result.transformedString).toContain('// 3. Background');
            });

            it('should use custom comment template with count variable', async () => {
                const result = await useCase.execute({
                    classNameString: 'w-full h-9 px-3 py-2 bg-transparent',
                    threshold: 0,
                    commentTemplate: '// {groupName} ({count})'
                });

                expect(result.shouldTransform).toBe(true);
                expect(result.transformedString).toContain('// Size (2)');
                expect(result.transformedString).toContain('// Spacing (2)');
                expect(result.transformedString).toContain('// Background (1)');
            });

            it('should use custom comment template with all variables', async () => {
                const result = await useCase.execute({
                    classNameString: 'w-full px-3 bg-transparent',
                    threshold: 0,
                    commentTemplate: '// {index}. {groupName} - {count} classes'
                });

                expect(result.shouldTransform).toBe(true);
                expect(result.transformedString).toContain('// 1. Size - 1 classes');
                expect(result.transformedString).toContain('// 2. Spacing - 1 classes');
                expect(result.transformedString).toContain('// 3. Background - 1 classes');
            });

            it('should use bracket format template', async () => {
                const result = await useCase.execute({
                    classNameString: 'w-full px-3',
                    threshold: 0,
                    commentTemplate: '// [{groupName}]'
                });

                expect(result.shouldTransform).toBe(true);
                expect(result.transformedString).toContain('// [Size]');
                expect(result.transformedString).toContain('// [Spacing]');
            });

            it('should use JSDoc format template', async () => {
                const result = await useCase.execute({
                    classNameString: 'w-full px-3',
                    threshold: 0,
                    commentTemplate: '/** {groupName} **/'
                });

                expect(result.shouldTransform).toBe(true);
                expect(result.transformedString).toContain('/** Size **/');
                expect(result.transformedString).toContain('/** Spacing **/');
            });

            it('should handle empty template', async () => {
                const result = await useCase.execute({
                    classNameString: 'w-full px-3',
                    threshold: 0,
                    commentTemplate: ''
                });

                expect(result.shouldTransform).toBe(true);
                // Should not contain any default comment markers
                expect(result.transformedString).not.toContain('// Size');
                expect(result.transformedString).not.toContain('// Spacing');
            });
        });

        describe('sorting', () => {
            it('should preserve original order when order is "no-sort"', async () => {
                const result = await useCase.execute({
                    classNameString: 'w-full h-9 min-w-0',
                    threshold: 0,
                    order: 'no-sort'
                });

                expect(result.shouldTransform).toBe(true);
                expect(result.transformedString).toContain('"w-full h-9 min-w-0"');
            });

            it('should sort alphabetically ascending when order is asc', async () => {
                const result = await useCase.execute({
                    classNameString: 'w-full h-9 min-w-0',
                    threshold: 0,
                    order: 'asc'
                });

                expect(result.shouldTransform).toBe(true);
                expect(result.transformedString).toContain('"h-9 min-w-0 w-full"');
            });

            it('should sort alphabetically descending when order is desc', async () => {
                const result = await useCase.execute({
                    classNameString: 'h-9 min-w-0 w-full',
                    threshold: 0,
                    order: 'desc'
                });

                expect(result.shouldTransform).toBe(true);
                expect(result.transformedString).toContain('"w-full min-w-0 h-9"');
            });

            it('should sort using official Tailwind order when order is official', async () => {
                // Use multiple classes from the same groups in wrong order
                // Spacing: pb, pt, px, p -> should sort to p, px, pt, pb (Tailwind's official order)
                // Size: min-w-0, w-full, h-9 -> should sort to w-full, min-w-0, h-9
                const result = await useCase.execute({
                    classNameString: 'pb-3 min-w-0 pt-1 w-full px-2 h-9 p-4',
                    threshold: 0,
                    order: 'official'
                });

                expect(result.shouldTransform).toBe(true);
                expect(result.transformedString).toBeDefined();

                expect(result.transformedString).toContain('// Size');
                expect(result.transformedString).toContain('// Spacing');

                // Verify the classes are reordered (not in original order)
                // Original order in Spacing was: pb-3, pt-1, px-2, p-4
                // We can at least verify they're not in that exact order by checking
                // that p-4 (most general) comes before pt-1 (more specific)
                const spacingMatch = result.transformedString?.match(/\/\/ Spacing\s+"([^"]+)"/);
                expect(spacingMatch).toBeDefined();
                if (spacingMatch) {
                    const spacingClasses = spacingMatch[1];
                    const p4Index = spacingClasses.indexOf('p-4');
                    const pt1Index = spacingClasses.indexOf('pt-1');
                    // In Tailwind's official order, p-4 should come before pt-1
                    expect(p4Index).toBeLessThan(pt1Index);
                }
            });

            it('should sort within each group independently', async () => {
                const result = await useCase.execute({
                    classNameString: 'w-full h-9 py-2 px-3',
                    threshold: 0,
                    order: 'asc'
                });

                expect(result.shouldTransform).toBe(true);
                // Size group: w-full, h-9 -> h-9, w-full
                // Spacing group: py-2, px-3 -> px-3, py-2
                expect(result.transformedString).toContain('"h-9 w-full"');
                expect(result.transformedString).toContain('"px-3 py-2"');
            });
        });
    });
});