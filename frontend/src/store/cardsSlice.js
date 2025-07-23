import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  byId: {},
  allIds: [],
  loading: false,
  error: null,
};

const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    setCardsLoading(state, action) {
      state.loading = action.payload;
    },
    setCardsError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    setAllCards(state, action) {
      const cards = action.payload;
      state.byId = {};
      state.allIds = [];
      
      cards.forEach(card => {
        state.byId[card.id] = card;
        state.allIds.push(card.id);
      });
      state.loading = false;
      state.error = null;
    },
    updateCard(state, action) {
      const { cardId, updates } = action.payload;
      if (state.byId[cardId]) {
        state.byId[cardId] = { ...state.byId[cardId], ...updates };
      }
    },
  },
});

export const { setCardsLoading, setCardsError, setAllCards, updateCard } = cardsSlice.actions;
export default cardsSlice.reducer; 