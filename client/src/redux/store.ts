import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './root-reducer';

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export default store;

export const configureStoreWithOptions = (options: any): any => {
  return configureStore({
    reducer: rootReducer,
    ...options,
  });
};
