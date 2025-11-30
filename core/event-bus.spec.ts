import { beforeEach, describe, expect, it, vi } from "vitest";
import { EventBus } from "./event-bus";

interface TestEvents {
  "test:1": {};
  "test:2": {};
}

describe("EventBus", () => {
  let bus: EventBus<TestEvents>;

  beforeEach(() => {
    bus = new EventBus<TestEvents>();
  });

  it("should call handler when event is published", () => {
    const handler = vi.fn();
    const testEvent = "test:1";
    bus.subscribe(testEvent, handler);
    bus.publish(testEvent, {});
    expect(handler).toBeCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({});
  });

  it("should call all subscribed handlers when event is published", () => {
    const handlers = Array.from({ length: 3 }, () => vi.fn());
    const testEvent = "test:1";
    handlers.forEach((handler) => {
      bus.subscribe(testEvent, handler);
    });
    bus.publish(testEvent, {});
    handlers.forEach((handler) => {
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith({});
    });
  });

  it("should not call handler for different event type", () => {
    const handler = vi.fn();
    bus.subscribe("test:2", handler);
    bus.publish("test:1", {});
    expect(handler).not.toHaveBeenCalled();
  });

  it("should handle publishing event with no subscribers", () => {
    bus.publish("test:1", {});
  });

  it("should allow same handler to subscribe multiple times", () => {
    const handler = vi.fn();
    bus.subscribe("test:1", handler);
    bus.subscribe("test:1", handler);
    bus.publish("test:1", {});
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it("should unsubscribe when handler exists", () => {
    const handler = vi.fn();
    const event = "test:1";
    bus.subscribe(event, handler);
    bus.unsubscribe(event, handler);
    bus.publish(event, {});
    expect(handler).not.toHaveBeenCalled();
  });

  it("should throw when unsubscribing with event missing", () => {
    expect(() => bus.unsubscribe("test:1", vi.fn())).toThrowError(
      "[EventBus] - Event not found",
    );
  });

  it("should throw when unsubscribing with missing handler", () => {
    const subscribedHandler = vi.fn();
    const differentHandler = vi.fn();
    bus.subscribe("test:1", subscribedHandler);
    expect(() => bus.unsubscribe("test:1", differentHandler)).toThrowError(
      "[EventBus] - Handler not found",
    );
  });

  it("should unsubscribe all handlers of event", () => {
    const handlers = Array.from({ length: 3 }, () => vi.fn());
    const testEvent = "test:1";
    handlers.forEach((handler) => {
      bus.subscribe(testEvent, handler);
    });
    expect(bus.unsubscribeAll(testEvent)).toBe(true);
    bus.publish(testEvent, {});
    handlers.forEach((handler) => {
      expect(handler).not.toHaveBeenCalled();
    });
  });

  it("should return false when unsubscribing all with missing event", () => {
    expect(bus.unsubscribeAll("test:1")).toBe(false);
  });
});
