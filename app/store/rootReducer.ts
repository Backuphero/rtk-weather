import { combineReducers } from '@reduxjs/toolkit';
import weatherReducer from './slice/weatherSlice';

const rootReducer = combineReducers({
  weather: weatherReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
