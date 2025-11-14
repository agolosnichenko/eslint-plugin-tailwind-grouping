import {renderCommentTemplate} from '../../../src/domain/utils/CommentTemplateRenderer';

describe('CommentTemplateRenderer', () => {
    describe('renderCommentTemplate', () => {
        it('should replace {groupName} variable', () => {
            const result = renderCommentTemplate('// {groupName}', {
                groupName: 'Size',
                index: 1,
                count: 3
            });

            expect(result).toBe('// Size');
        });

        it('should replace {index} variable', () => {
            const result = renderCommentTemplate('// {index}. Group', {
                groupName: 'Size',
                index: 2,
                count: 3
            });

            expect(result).toBe('// 2. Group');
        });

        it('should replace {count} variable', () => {
            const result = renderCommentTemplate('// ({count} classes)', {
                groupName: 'Size',
                index: 1,
                count: 5
            });

            expect(result).toBe('// (5 classes)');
        });

        it('should replace all variables in a template', () => {
            const result = renderCommentTemplate('// {index}. {groupName} ({count})', {
                groupName: 'Spacing',
                index: 3,
                count: 7
            });

            expect(result).toBe('// 3. Spacing (7)');
        });

        it('should handle block comment format', () => {
            const result = renderCommentTemplate('/* {groupName} */', {
                groupName: 'Border',
                index: 1,
                count: 2
            });

            expect(result).toBe('/* Border */');
        });

        it('should handle JSDoc format', () => {
            const result = renderCommentTemplate('/** {groupName} **/', {
                groupName: 'Effects',
                index: 1,
                count: 4
            });

            expect(result).toBe('/** Effects **/');
        });

        it('should handle bracket format', () => {
            const result = renderCommentTemplate('// [{groupName}]', {
                groupName: 'Layout',
                index: 2,
                count: 10
            });

            expect(result).toBe('// [Layout]');
        });

        it('should handle templates without variables', () => {
            const result = renderCommentTemplate('// Group', {
                groupName: 'Size',
                index: 1,
                count: 3
            });

            expect(result).toBe('// Group');
        });

        it('should handle multiple occurrences of the same variable', () => {
            const result = renderCommentTemplate('// {groupName} - {groupName}', {
                groupName: 'Text',
                index: 1,
                count: 2
            });

            expect(result).toBe('// Text - Text');
        });

        it('should handle uppercase template', () => {
            const result = renderCommentTemplate('// {groupName}', {
                groupName: 'SIZE',
                index: 1,
                count: 1
            });

            expect(result).toBe('// SIZE');
        });

        it('should preserve whitespace in template', () => {
            const result = renderCommentTemplate('//   {groupName}   ', {
                groupName: 'Spacing',
                index: 1,
                count: 2
            });

            expect(result).toBe('//   Spacing   ');
        });
    });
});