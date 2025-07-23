import { configureStore } from '@reduxjs/toolkit';
import progressReducer from './progressSlice';
import cardsReducer from './cardsSlice';

const store = configureStore({
  reducer: {
    progress: progressReducer,
    cards: cardsReducer,
  },
});

export default store;