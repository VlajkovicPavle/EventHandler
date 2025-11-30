export type AppEvent<TEventMap extends Record<string, any>> = {
  [K in keyof TEventMap]: {
    type: K;
    data: TEventMap[K];
  };
}[keyof TEventMap];

export type EventHandler<TEventMap, K extends keyof TEventMap> = (
  data: TEventMap[K],
) => void;
