import { EventHandler } from "../types/event.types";

export class EventBus<TEventMap extends Record<string, any>> {
  private _handlers = new Map<keyof TEventMap, Array<(data: any) => void>>();

  subscribe<K extends keyof TEventMap>(
    event: K,
    handler: EventHandler<TEventMap, K>,
  ) {
    if (!this._handlers.has(event)) {
      this._handlers.set(event, []);
    }
    this._handlers.get(event)!.push(handler);
  }

  publish<K extends keyof TEventMap>(event: K, data: TEventMap[K]) {
    this._handlers.get(event)?.forEach((handler) => {
      handler(data);
    });
  }
}
