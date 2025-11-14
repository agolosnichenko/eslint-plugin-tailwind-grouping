/**
 * Simple glob pattern matcher
 * Supports basic wildcards: * and **
 */
export class GlobMatcher {
    /**
     * Checks if a file path matches any of the patterns
     */
    static matchesAny(filePath: string, patterns: string[]): boolean {
        if (patterns.length === 0) {
            return false;
        }

        return patterns.some(pattern => this.matches(filePath, pattern));
    }

    /**
     * Checks if a file path matches a single pattern
     */
    static matches(filePath: string, pattern: string): boolean {
        // Normalize paths (convert to forward slashes)
        const normalizedPath = filePath.replace(/\\/g, '/');
        const normalizedPattern = pattern.replace(/\\/g, '/');

        // Convert glob pattern to regex
        const regexPattern = this.globToRegex(normalizedPattern);
        const regex = new RegExp(regexPattern);

        return regex.test(normalizedPath);
    }

    /**
     * Converts a glob pattern to a regular expression
     */
    private static globToRegex(pattern: string): string {
        let regex = '^';
        let i = 0;

        while (i < pattern.length) {
            const char = pattern[i];

            if (char === '*') {
                // Check for **
                if (pattern[i + 1] === '*') {
                    regex += '.*';
                    i += 2;
                    // Skip the following slash if present
                    if (pattern[i] === '/') {
                        regex += '\\/';
                        i++;
                    }
                } else {
                    // Single * matches anything except /
                    regex += '[^/]*';
                    i++;
                }
            } else if (char === '?') {
                regex += '[^/]';
                i++;
            } else if (char === '.') {
                regex += '\\.';
                i++;
            } else if (char === '/') {
                regex += '\\/';
                i++;
            } else {
                // Regular character
                regex += this.escapeRegex(char);
                i++;
            }
        }

        regex += '$';
        return regex;
    }

    /**
     * Escapes special regex characters
     */
    private static escapeRegex(char: string): string {
        const specialChars = ['\\', '^', '$', '+', '?', '.', '(', ')', '[', ']', '{', '}', '|'];
        if (specialChars.includes(char)) {
            return '\\' + char;
        }
        return char;
    }
}