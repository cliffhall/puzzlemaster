import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Only apply DOM shims when running in a browser-like environment (jsdom)
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const { getComputedStyle } = window;
  window.getComputedStyle = (elt) => getComputedStyle(elt);
  window.HTMLElement.prototype.scrollIntoView = () => {};

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  // @ts-ignore
  window.ResizeObserver = ResizeObserver;
}


// Mock Electron-only utilities to avoid importing 'electron' in Node tests
vi.mock('@electron-toolkit/utils', () => ({
  is: { dev: false, prod: true },
}));
