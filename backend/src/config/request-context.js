import { AsyncLocalStorage } from "node:async_hooks";

const requestContextStorage = new AsyncLocalStorage();

export const runWithRequestContext = (context, callback) => requestContextStorage.run(context, callback);

export const getRequestContext = () => requestContextStorage.getStore() ?? {};

export const updateRequestContext = (patch) => {
  const store = requestContextStorage.getStore();
  if (!store) return;
  Object.assign(store, patch);
};
