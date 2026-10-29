import { TextDecoder, TextEncoder } from 'node:util'

import '@testing-library/jest-dom'

Object.assign(globalThis, {
  TextEncoder,
  TextDecoder,
})

Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_URL: 'http://localhost:5000',
  },
  writable: true,
})

class ResizeObserverMock {
  /**
   * @description Jest stub for ResizeObserver used by Lenis in public layout tests.
   */
  observe() {
    return undefined
  }

  /**
   * @description Jest stub disconnect.
   */
  disconnect() {
    return undefined
  }

  /**
   * @description Jest stub unobserve.
   */
  unobserve() {
    return undefined
  }
}

Object.defineProperty(globalThis, 'ResizeObserver', {
  writable: true,
  value: ResizeObserverMock,
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  }),
})
