// Shared page-level TypeScript types

export type RouteParams<T extends string = string> = Record<T, string>

export type PageSearchParams = Record<string, string | string[] | undefined>

// Generic shape for API success/failure already defined in common.ts
// This file focuses on Next.js page props/hooks typing convenience.

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'