import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import deckReducer from './slices/deckSlice';
import revisionReducer from './slices/revisionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    decks: deckReducer,
    revision: revisionReducer,
  },
});

export default store;
