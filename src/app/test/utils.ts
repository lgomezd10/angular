/*
 * Utility functions for our browser tests
 */

export function createEvent(eventType: string, bubbles: boolean = true, cancelable: boolean = true): Event {
  return new Event(eventType, { bubbles, cancelable });
}

export function dispatchEvent(element: HTMLElement, eventType: string): void {
  element.dispatchEvent(createEvent(eventType));
}

export class ConsoleSpy {
  public logs: string[] = [];

  log(...args: any[]): void {
    this.logs.push(args.join(' '));
  }

  warn(...args: any[]): void {
    this.log(...args);
  }
}
  