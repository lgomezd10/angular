import '@angular/compiler';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';

// Configura el entorno global de TestBed para Vitest
setupTestBed();

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

// Mock global para ResizeObserver (necesario para PrimeNG TabList en tests)
if (!globalThis.ResizeObserver) {
	globalThis.ResizeObserver = class ResizeObserver {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
}