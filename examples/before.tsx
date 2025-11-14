// @ts-nocheck
import React from 'react';

/**
 * Example component with unorganized Tailwind classes
 * This should be automatically transformed by the ESLint plugin
 */
export const SelectComponent: React.FC = () => {
    return (
        <select className="border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 dark:hover:bg-input/50 h-9 w-full min-w-0 appearance-none rounded-md border bg-transparent px-3 py-2 pr-9 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed">
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
        </select>
    );
};

export const CardComponent: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-between p-6 m-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Card Title
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                Card content goes here
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors">
                Action
            </button>
        </div>
    );
};

export const FormInputComponent: React.FC = () => {
    return (
        <input
            type="text"
            className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Enter text..."
        />
    );
};