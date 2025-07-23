import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  byId: {}, 
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    setAllProgress(state, action) {
     
      state.byId = action.payload;
    },
    setProgress(state, action) {
      
      state.byId[action.payload.cardId] = action.payload.progress;
    },
  },
});

export const { setAllProgress, setProgress } = progressSlice.actions;
export default progressSlice.reducer;