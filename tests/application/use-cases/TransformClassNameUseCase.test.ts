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
        it('should not transform when below threshold', () => {
            const result = useCase.execute({
                classNameString: 'bg-blue-500 text-white',
                threshold: 5
            });

            expect(result.shouldTransform).toBe(false);
            expect(result.originalString).toBe('bg-blue-500 text-white');
        });

        it('should transform when meeting threshold', () => {
            const result = useCase.execute({
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

        it('should transform with threshold 0', () => {
            const result = useCase.execute({
                classNameString: 'bg-blue-500',
                threshold: 0
            });

            expect(result.shouldTransform).toBe(true);
        });

        it('should handle empty string', () => {
            const result = useCase.execute({
                classNameString: '',
                threshold: 0
            });

            expect(result.shouldTransform).toBe(false);
        });

        it('should handle multiple spaces', () => {
            const result = useCase.execute({
                classNameString: 'bg-blue-500   text-white    p-4',
                threshold: 0
            });

            expect(result.shouldTransform).toBe(true);
            expect(result.grouping?.getTotalClassCount()).toBe(3);
        });

        it('should produce correct clsx format', () => {
            const result = useCase.execute({
                classNameString: 'h-9 w-full px-3 border bg-transparent',
                threshold: 0
            });

            expect(result.transformedString).toMatch(/clsx\(/);
            expect(result.transformedString).toMatch(/\/\/ Size/);
            expect(result.transformedString).toMatch(/"h-9 w-full"/);
            expect(result.transformedString).toMatch(/\/\/ Spacing/);
            expect(result.transformedString).toMatch(/"px-3"/);
        });

        it('should handle real-world example from the spec', () => {
            const result = useCase.execute({
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
    });
});