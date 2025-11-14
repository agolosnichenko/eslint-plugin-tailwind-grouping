/**
 * Mapping configuration from group names to class patterns
 * Follows Option B format: { "GroupName": ["pattern1", "pattern2"] }
 */
export type GroupMapping = Record<string, string[]>;

/**
 * Default group order for Tailwind classes
 */
export const DEFAULT_GROUP_ORDER = [
    'Size',
    'Layout',
    'Spacing',
    'Border',
    'Background',
    'Text',
    'Effects',
    'Others'
] as const;

/**
 * Default mapping of Tailwind classes to groups
 */
export const DEFAULT_GROUP_MAPPING: GroupMapping = {
    Size: [
        'w-*', 'h-*', 'min-w-*', 'max-w-*', 'min-h-*', 'max-h-*',
        'size-*'
    ],
    Layout: [
        'container',
        'box-*',
        'block', 'inline-block', 'inline', 'flex', 'inline-flex', 'grid', 'inline-grid',
        'hidden', 'table', 'table-*',
        'flow-*',
        'static', 'fixed', 'absolute', 'relative', 'sticky',
        'top-*', 'right-*', 'bottom-*', 'left-*', 'inset-*',
        'z-*',
        'float-*', 'clear-*',
        'isolate', 'isolation-*',
        'object-*',
        'overflow-*',
        'overscroll-*',
        'visible', 'invisible',
        'flex-*', 'grow-*', 'shrink-*',
        'order-*',
        'grid-*', 'col-*', 'row-*',
        'gap-*',
        'justify-*', 'content-*', 'items-*', 'self-*',
        'place-*'
    ],
    Spacing: [
        'p-*', 'px-*', 'py-*', 'pt-*', 'pr-*', 'pb-*', 'pl-*', 'ps-*', 'pe-*',
        'm-*', 'mx-*', 'my-*', 'mt-*', 'mr-*', 'mb-*', 'ml-*', 'ms-*', 'me-*',
        'space-*',
        '-m-*', '-mx-*', '-my-*', '-mt-*', '-mr-*', '-mb-*', '-ml-*', '-ms-*', '-me-*'
    ],
    Border: [
        'border-*', 'border',
        'divide-*',
        'outline-*', 'outline',
        'ring-*', 'ring',
        'rounded-*', 'rounded'
    ],
    Background: [
        'bg-*',
        'from-*', 'via-*', 'to-*',
        'decoration-*',
        'selection'
    ],
    Text: [
        'text-*',
        'font-*',
        'leading-*',
        'tracking-*',
        'line-clamp-*',
        'truncate',
        'whitespace-*',
        'break-*',
        'hyphens-*',
        'content-*',
        'uppercase', 'lowercase', 'capitalize', 'normal-case',
        'italic', 'not-italic',
        'underline', 'overline', 'line-through', 'no-underline',
        'antialiased', 'subpixel-antialiased',
        'ordinal', 'slashed-zero',
        'tabular-nums', 'diagonal-fractions', 'stacked-fractions',
        'list-*',
        'placeholder-*',
        'caret-*'
    ],
    Effects: [
        'shadow-*', 'shadow',
        'opacity-*',
        'mix-*',
        'blur-*',
        'brightness-*',
        'contrast-*',
        'drop-shadow-*',
        'grayscale-*',
        'hue-rotate-*',
        'invert-*',
        'saturate-*',
        'sepia-*',
        'backdrop-*',
        'transition-*', 'transition',
        'duration-*',
        'ease-*',
        'delay-*',
        'animate-*',
        'transform', 'transform-*',
        'scale-*',
        'rotate-*',
        'translate-*',
        'skew-*',
        'origin-*',
        'accent-*',
        'appearance-*',
        'cursor-*',
        'pointer-events-*',
        'resize-*',
        'scroll-*',
        'snap-*',
        'touch-*',
        'select-*',
        'will-change-*'
    ],
    Others: [] // Catch-all for unknown classes
};