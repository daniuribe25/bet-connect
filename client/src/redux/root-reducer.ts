import { combineReducers } from '@reduxjs/toolkit';
import sessionReducer from './slices/session-slice';
import lobbyReducer from './slices/lobby-slice';
import tourneysReducer from './slices/tournaments-slice';

const appReducer = combineReducers({
  session: sessionReducer,
  lobby: lobbyReducer,
  tourneys: tourneysReducer,
});

export type RootState = ReturnType<typeof appReducer>;
export default appReducer;
