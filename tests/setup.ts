import '@testing-library/jest-dom/vitest'
import { beforeEach, vi } from 'vitest'

// Vitest's global bridge can expose Node's disabled localStorage instead of jsdom's.
// Keep a functional storage boundary for browser persistence integration tests.
beforeEach(() => {
  const entries = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => entries.get(key) ?? null,
    setItem: (key: string, value: string) => { entries.set(key, String(value)) },
    removeItem: (key: string) => { entries.delete(key) },
    clear: () => entries.clear(),
    key: (index: number) => [...entries.keys()][index] ?? null,
    get length() { return entries.size },
  })
})
