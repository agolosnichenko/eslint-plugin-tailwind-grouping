import {TailwindClass} from '../../../src/domain/value-objects/TailwindClass';

describe('TailwindClass', () => {
    describe('create', () => {
        it('should create a class without modifiers', () => {
            const tailwindClass = TailwindClass.create('bg-blue-500');

            expect(tailwindClass.original).toBe('bg-blue-500');
            expect(tailwindClass.baseClass).toBe('bg-blue-500');
            expect(tailwindClass.modifiers).toEqual([]);
        });

        it('should create a class with single modifier', () => {
            const tailwindClass = TailwindClass.create('dark:bg-blue-500');

            expect(tailwindClass.original).toBe('dark:bg-blue-500');
            expect(tailwindClass.baseClass).toBe('bg-blue-500');
            expect(tailwindClass.modifiers).toEqual(['dark']);
        });

        it('should create a class with multiple modifiers', () => {
            const tailwindClass = TailwindClass.create('dark:hover:bg-blue-500');

            expect(tailwindClass.original).toBe('dark:hover:bg-blue-500');
            expect(tailwindClass.baseClass).toBe('bg-blue-500');
            expect(tailwindClass.modifiers).toEqual(['dark', 'hover']);
        });

        it('should handle arbitrary values', () => {
            const tailwindClass = TailwindClass.create('w-[500px]');

            expect(tailwindClass.original).toBe('w-[500px]');
            expect(tailwindClass.baseClass).toBe('w-[500px]');
            expect(tailwindClass.modifiers).toEqual([]);
        });

        it('should handle arbitrary values with modifiers', () => {
            const tailwindClass = TailwindClass.create('md:w-[500px]');

            expect(tailwindClass.original).toBe('md:w-[500px]');
            expect(tailwindClass.baseClass).toBe('w-[500px]');
            expect(tailwindClass.modifiers).toEqual(['md']);
        });
    });

    describe('getPatternForMatching', () => {
        it('should return the class itself for regular classes', () => {
            const tailwindClass = TailwindClass.create('bg-blue-500');
            expect(tailwindClass.getPatternForMatching()).toBe('bg-blue-500');
        });

        it('should convert arbitrary values to wildcard pattern', () => {
            const tailwindClass = TailwindClass.create('w-[500px]');
            expect(tailwindClass.getPatternForMatching()).toBe('w-*');
        });

        it('should handle complex arbitrary values', () => {
            const tailwindClass = TailwindClass.create('bg-[rgb(255,0,0)]');
            expect(tailwindClass.getPatternForMatching()).toBe('bg-*');
        });
    });

    describe('matchesPattern', () => {
        it('should match exact pattern', () => {
            const tailwindClass = TailwindClass.create('bg-blue-500');
            expect(tailwindClass.matchesPattern('bg-blue-500')).toBe(true);
            expect(tailwindClass.matchesPattern('bg-red-500')).toBe(false);
        });

        it('should match wildcard pattern', () => {
            const tailwindClass = TailwindClass.create('bg-blue-500');
            expect(tailwindClass.matchesPattern('bg-*')).toBe(true);
            expect(tailwindClass.matchesPattern('text-*')).toBe(false);
        });

        it('should match arbitrary values with wildcard', () => {
            const tailwindClass = TailwindClass.create('w-[500px]');
            expect(tailwindClass.matchesPattern('w-*')).toBe(true);
            expect(tailwindClass.matchesPattern('h-*')).toBe(false);
        });

        it('should handle modifiers in matching', () => {
            const tailwindClass = TailwindClass.create('dark:bg-blue-500');
            expect(tailwindClass.matchesPattern('bg-*')).toBe(true);
        });
    });

    describe('toString', () => {
        it('should return the original class string', () => {
            const tailwindClass = TailwindClass.create('dark:hover:bg-blue-500');
            expect(tailwindClass.toString()).toBe('dark:hover:bg-blue-500');
        });
    });

    describe('equals', () => {
        it('should return true for identical classes', () => {
            const class1 = TailwindClass.create('bg-blue-500');
            const class2 = TailwindClass.create('bg-blue-500');
            expect(class1.equals(class2)).toBe(true);
        });

        it('should return false for different classes', () => {
            const class1 = TailwindClass.create('bg-blue-500');
            const class2 = TailwindClass.create('bg-red-500');
            expect(class1.equals(class2)).toBe(false);
        });
    });
});