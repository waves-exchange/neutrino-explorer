export type PromiseEntry<T extends Promise<any>> = T extends Promise<infer R> ? R : never;