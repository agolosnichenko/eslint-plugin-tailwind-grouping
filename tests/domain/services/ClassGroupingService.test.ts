import {ClassGroupingService} from '../../../src/domain/services/ClassGroupingService';
import {TailwindClass} from '../../../src/domain/value-objects/TailwindClass';
import {DEFAULT_GROUP_ORDER, DEFAULT_GROUP_MAPPING} from '../../../src/config/defaults';

describe('ClassGroupingService', () => {
    let service: ClassGroupingService;

    beforeEach(() => {
        service = new ClassGroupingService(DEFAULT_GROUP_ORDER, DEFAULT_GROUP_MAPPING);
    });

    describe('groupClasses', () => {
        it('should group size classes correctly', () => {
            const classes = [
                TailwindClass.create('w-full'),
                TailwindClass.create('h-9'),
                TailwindClass.create('min-w-0')
            ];

            const grouping = service.groupClasses(classes);
            const sizeGroup = grouping.groups.find(g => g.name === 'Size');

            expect(sizeGroup).toBeDefined();
            expect(sizeGroup!.classes).toHaveLength(3);
            expect(sizeGroup!.toClassString()).toBe('w-full h-9 min-w-0');
        });

        it('should group classes with modifiers', () => {
            const classes = [
                TailwindClass.create('bg-transparent'),
                TailwindClass.create('dark:bg-input/30'),
                TailwindClass.create('dark:hover:bg-input/50')
            ];

            const grouping = service.groupClasses(classes);
            const bgGroup = grouping.groups.find(g => g.name === 'Background');

            expect(bgGroup).toBeDefined();
            expect(bgGroup!.classes).toHaveLength(3);
            expect(bgGroup!.toClassString()).toContain('dark:bg-input/30');
        });

        it('should handle arbitrary values', () => {
            const classes = [
                TailwindClass.create('w-[500px]'),
                TailwindClass.create('h-[300px]')
            ];

            const grouping = service.groupClasses(classes);
            const sizeGroup = grouping.groups.find(g => g.name === 'Size');

            expect(sizeGroup).toBeDefined();
            expect(sizeGroup!.classes).toHaveLength(2);
            expect(sizeGroup!.toClassString()).toBe('w-[500px] h-[300px]');
        });

        it('should put unknown classes in Others group', () => {
            const classes = [
                TailwindClass.create('custom-class'),
                TailwindClass.create('another-unknown')
            ];

            const grouping = service.groupClasses(classes);
            const othersGroup = grouping.groups.find(g => g.name === 'Others');

            expect(othersGroup).toBeDefined();
            expect(othersGroup!.classes).toHaveLength(2);
        });

        it('should group multiple categories correctly', () => {
            const classes = [
                TailwindClass.create('h-9'),
                TailwindClass.create('w-full'),
                TailwindClass.create('px-3'),
                TailwindClass.create('py-2'),
                TailwindClass.create('border'),
                TailwindClass.create('rounded-md'),
                TailwindClass.create('bg-transparent')
            ];

            const grouping = service.groupClasses(classes);

            expect(grouping.groups.find(g => g.name === 'Size')!.size).toBe(2);
            expect(grouping.groups.find(g => g.name === 'Spacing')!.size).toBe(2);
            expect(grouping.groups.find(g => g.name === 'Border')!.size).toBe(2);
            expect(grouping.groups.find(g => g.name === 'Background')!.size).toBe(1);
        });

        it('should preserve order within groups', () => {
            const classes = [
                TailwindClass.create('h-9'),
                TailwindClass.create('w-full'),
                TailwindClass.create('h-10')
            ];

            const grouping = service.groupClasses(classes);
            const sizeGroup = grouping.groups.find(g => g.name === 'Size');

            expect(sizeGroup!.toClassString()).toBe('h-9 w-full h-10');
        });
    });

    describe('custom mapping', () => {
        it('should work with custom group mappings', () => {
            const customMapping = {
                CustomGroup: ['custom-*'],
                Others: []
            };
            const customOrder = ['CustomGroup', 'Others'];

            const customService = new ClassGroupingService(customOrder, customMapping);
            const classes = [
                TailwindClass.create('custom-class'),
                TailwindClass.create('custom-another')
            ];

            const grouping = customService.groupClasses(classes);
            const customGroup = grouping.groups.find(g => g.name === 'CustomGroup');

            expect(customGroup).toBeDefined();
            expect(customGroup!.classes).toHaveLength(2);
        });
    });
});