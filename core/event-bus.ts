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

  unsubscribe<K extends keyof TEventMap>(
    event: K,
    handler: EventHandler<TEventMap, K>,
  ) {
    const handlers = this._handlers.get(event);
    if (!handlers) {
      throw new Error("[EventBus] - Event not found");
    }
    const filtered = handlers.filter(
      (savedHandler) => savedHandler !== handler,
    );
    if (filtered.length === handlers.length) {
      throw new Error("[EventBus] - Handler not found");
    }
    this._handlers.set(event, filtered);
  }

  unsubscribeALl<K extends keyof TEventMap>(event: K) {
    return this._handlers.delete(event);
  }

  publish<K extends keyof TEventMap>(event: K, data: TEventMap[K]) {
    this._handlers.get(event)?.forEach((handler) => {
      handler(data);
    });
  }
}
