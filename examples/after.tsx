//@ts-nocheck
import React from 'react';
import {clsx} from 'clsx';

/**
 * Example component after ESLint plugin transformation
 * Classes are now organized into semantic groups for better readability
 */
export const SelectComponent: React.FC = () => {
    return (
        <select
            className={clsx(
                // Size
                "h-9 w-full min-w-0",
                // Spacing
                "px-3 py-2 pr-9",
                // Border
                "border border-input outline-none rounded-md",
                // Background
                "bg-transparent dark:bg-input/30 dark:hover:bg-input/50 selection:bg-primary",
                // Text
                "text-sm selection:text-primary-foreground placeholder:text-muted-foreground",
                // Effects
                "appearance-none shadow-xs transition-[color,box-shadow]",
                // Others
                "disabled:pointer-events-none disabled:cursor-not-allowed"
            )}
        >
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
        </select>
    );
};

export const CardComponent: React.FC = () => {
    return (
        <div
            className={clsx(
                // Layout
                "flex flex-col items-center justify-between",
                // Spacing
                "p-6 m-4",
                // Border
                "border border-gray-200 dark:border-gray-700 rounded-lg",
                // Background
                "bg-white dark:bg-gray-900",
                // Effects
                "shadow-md hover:shadow-lg transition-all duration-200"
            )}
        >
            <h2
                className={clsx(
                    // Spacing
                    "mb-4",
                    // Text
                    "text-2xl font-bold text-gray-900 dark:text-white"
                )}
            >
                Card Title
            </h2>
            <p
                className={clsx(
                    // Text
                    "text-base text-gray-600 dark:text-gray-400 leading-relaxed"
                )}
            >
                Card content goes here
            </p>
            <button
                className={clsx(
                    // Spacing
                    "mt-4 px-4 py-2",
                    // Border
                    "rounded-md",
                    // Background
                    "bg-blue-500 hover:bg-blue-600",
                    // Text
                    "text-white font-medium",
                    // Effects
                    "transition-colors"
                )}
            >
                Action
            </button>
        </div>
    );
};

export const FormInputComponent: React.FC = () => {
    return (
        <input
            type="text"
            className={clsx(
                // Size
                "w-full h-10",
                // Spacing
                "px-3 py-2",
                // Border
                "border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                // Text
                "text-sm placeholder:text-gray-400",
                // Others
                "disabled:bg-gray-100 disabled:cursor-not-allowed"
            )}
            placeholder="Enter text..."
        />
    );
};