# Examples

## Define your event map

```ts
interface AppEventMap {
  "task:created": { taskId: string; title: string; assigneeId: string };
  "task:completed": { taskId: string; completedAt: number };
  "task:deleted": { taskId: string; deletedBy: string };
  "comment:added": { taskId: string; commentId: string; text: string };
}
```

## Handle events with exhaustiveness checking

```ts
const handleEvent = (appEvent: AppEvent<AppEventMap>) => {
  switch (appEvent.type) {
    case "task:created":
      break;
    case "task:completed":
      break;
    case "task:deleted":
      break;
    case "comment:added":
      break;
    default:
      const _exhaustive: never = appEvent;
      throw new Error(`Unhandled event: ${_exhaustive}`);
  }
};
```
