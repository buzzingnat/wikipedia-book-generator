import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { sendSavedBook, fetchAllBooks } from './booksAPI';

export interface BooksState {
  results: any[];
  statusSaveBook: 'idle' | 'loading' | 'failed';
}

const initialState: BooksState = {
  results: [],
  statusSaveBook: 'idle',
};

/*
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
*/

// if response is successful, then add it to the table locally
export const saveBookAsync = createAsyncThunk(
  'books/sendSavedBook',
  async ({title, contents}: {title: string, contents: string}) => {
    const response = await sendSavedBook(title, contents);
    return response;
  }
);
// saveBookAsync('', '')
export const getBooksAsync = createAsyncThunk(
  'books/fetchAllBooks',
  async () => {
    const response = await fetchAllBooks();
    return response;
  }
);

export const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveBookAsync.pending, (state) => {
        state.statusSaveBook = 'loading';
      })
      .addCase(saveBookAsync.fulfilled, (state, action) => {
        state.statusSaveBook = 'idle';
        // state.results.push(action.payload);
      })
      .addCase(getBooksAsync.pending, (state) => {
        state.statusSaveBook = 'loading';
      })
      .addCase(getBooksAsync.fulfilled, (state, action) => {
        state.statusSaveBook = 'idle';
        state.results = action.payload;
      })
  },
});

export const selectAllBookResults = (state: RootState) => state.books.results;

export default booksSlice.reducer;
