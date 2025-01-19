import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentRevision: null,
  revisions: [],
  progress: null,
  loading: false,
  error: null,
};

const revisionSlice = createSlice({
  name: 'revision',
  initialState,
  reducers: {
    startRevision: (state, action) => {
      state.currentRevision = action.payload;
      state.loading = false;
      state.error = null;
    },
    submitAnswer: (state, action) => {
      if (state.currentRevision) {
        state.currentRevision.answers = [
          ...state.currentRevision.answers,
          action.payload,
        ];
      }
    },
    finishRevision: (state) => {
      state.currentRevision = null;
    },
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    setRevisions: (state, action) => {
      state.revisions = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  startRevision,
  submitAnswer,
  finishRevision,
  setProgress,
  setRevisions,
  setLoading,
  setError,
} = revisionSlice.actions;

export default revisionSlice.reducer;
