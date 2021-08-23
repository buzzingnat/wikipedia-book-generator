import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { fetchSearchResults, getArticleResults, getArticleSummaryText } from './searchAPI';

export interface SearchState {
  value: string;
  results: any[];
  details: Object;
  summary: {extract: string; ns: string; pagid: string; title: string};
  statusSearch: 'idle' | 'loading' | 'failed';
  statusDetails: 'idle' | 'loading' | 'failed';
  statusSummary: 'idle' | 'loading' | 'failed';
}

const initialState: SearchState = {
  value: '',
  results: [],
  details: {},
  summary: {
    extract: '',
    ns: '',
    pagid: '',
    title: ''
  },
  statusSearch: 'idle',
  statusDetails: 'idle',
  statusSummary: 'idle',
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const searchAsync = createAsyncThunk(
  'search/fetchSearchResults',
  async (searchTerm: string) => {
    const response = await fetchSearchResults(searchTerm);
    // The value we return becomes the `fulfilled` action payload
    return response.query.search;
  }
);

export const getArticleAsync = createAsyncThunk(
  'search/getArticleResults',
  async (pageId: string) => {
    const response = await getArticleResults(pageId);
    return response.parse;
  }
);

export const getSummaryTextAsync = createAsyncThunk(
  'search/getArticleSummaryText',
  async (pageId: string) => {
    const response = await getArticleSummaryText(pageId);
    return response.query.pages[pageId];
  }
);

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {},
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(searchAsync.pending, (state) => {
        state.statusSearch = 'loading';
      })
      .addCase(searchAsync.fulfilled, (state, action) => {
        state.statusSearch = 'idle';
        state.results = action.payload;
      })
      .addCase(getArticleAsync.pending, (state) => {
        state.statusDetails = 'loading';
      })
      .addCase(getArticleAsync.fulfilled, (state, action) => {
        state.statusDetails = 'idle';
        state.details = action.payload;
      })
      .addCase(getSummaryTextAsync.pending, (state) => {
        state.statusSummary = 'loading';
      })
      .addCase(getSummaryTextAsync.fulfilled, (state, action) => {
        state.statusSummary = 'idle';
        state.summary = action.payload;
      });
  },
});

export const selectSearchResults = (state: RootState) => state.search.results;
export const selectSummaryResults = (state: RootState) => state.search.summary;
export const selectDetailResults = (state: RootState) => state.search.details;
// export const selectCount = (state: RootState) => state.counter.value;

export default searchSlice.reducer;
