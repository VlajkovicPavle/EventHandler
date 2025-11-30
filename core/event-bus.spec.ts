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
});
