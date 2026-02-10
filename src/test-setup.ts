import { getTestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';

// Mock global para ResizeObserver (necesario para PrimeNG TabList en tests)
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class ResizeObserver {
    observe(_target: Element) {
      // Mock implementation for tests
    }
    unobserve(_target: Element) {
      // Mock implementation for tests
    }
    disconnect() {
      // Mock implementation for tests
    }
  };
}

// Mock global para window.matchMedia (necesario para PrimeNG en tests)
if (!globalThis.matchMedia) {
  globalThis.matchMedia = function (query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    };
  };
}

getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting(),
);