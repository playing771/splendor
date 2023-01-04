export const getKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>
export type Nullable<T> = T | null;