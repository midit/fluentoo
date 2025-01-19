import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  decks: [],
  currentDeck: null,
  loading: false,
  error: null,
};

const deckSlice = createSlice({
  name: 'decks',
  initialState,
  reducers: {
    fetchDecksStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDecksSuccess: (state, action) => {
      state.loading = false;
      state.decks = action.payload;
      state.error = null;
    },
    fetchDecksFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentDeck: (state, action) => {
      state.currentDeck = action.payload;
    },
    addDeck: (state, action) => {
      state.decks.push(action.payload);
    },
    updateDeck: (state, action) => {
      const index = state.decks.findIndex(
        (deck) => deck.id === action.payload.id
      );
      if (index !== -1) {
        state.decks[index] = action.payload;
      }
    },
    deleteDeck: (state, action) => {
      state.decks = state.decks.filter((deck) => deck.id !== action.payload);
    },
  },
});

export const {
  fetchDecksStart,
  fetchDecksSuccess,
  fetchDecksFailure,
  setCurrentDeck,
  addDeck,
  updateDeck,
  deleteDeck,
} = deckSlice.actions;

export default deckSlice.reducer;
