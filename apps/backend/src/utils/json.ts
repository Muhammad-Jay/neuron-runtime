export function safeParseJSON<T>(value: unknown): T | null {
    try {
        if (typeof value === "string") {
            return JSON.parse(value) as T
        }
        return value as T
    } catch {
        return null
    }
}