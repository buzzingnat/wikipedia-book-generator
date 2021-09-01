import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import {
  fetchSearchResults,
  getArticleResults,
  getArticleSummaryText,
  getArticleSummaryTextByTitle,
} from './searchAPI';

interface ArticleLink {
  ns: number;
  exists: string;
  "*": string;
}

interface ArticleDetails {
  displaytitle: string; //"<i>The Legend of Kyrandia</i>"
  images: string[]; //["Lok-b1.jpg"] (1)
  links: ArticleLink[]; // [{ns: 0, exists: "", *: "2D computer graphics"}, {ns: 0, exists: "", *: "AmigaOS"}, {ns: 0, exists: "", *: "Brett Sperry"}, {ns: 0, exists: "", *: "CD Projekt"}, {ns: 0, exists: "", *: "Computer Gaming World"}, {ns: 0, exists: "", *: "Computing platform"}, {ns: 0, exists: "", *: "DOS"}, {ns: 0, exists: "", *: "Emulator"}, {ns: 0, exists: "", *: "FM Towns"}, {ns: 0, exists: "", *: "Frank Klepacki"}, …] (31)
  pageid: number; // 58245564
  sections: any[]; // [] (0)
  subtitle: string; //""
  text: {"*": string}; // {*: "<div class=\"mw-parser-output\"><table class=\"infobo… 1.483 1 Template:Italic_title↵-->↵</div>"}
  title: string; // "The Legend of Kyrandia"
}

interface Summary {
  extract: string;
  ns: string;
  pageid: number;
  title: string;
}

type Pages = {
  [key: string]: Summary;
};

export interface SearchState {
  value: string;
  results: any[];
  details: ArticleDetails;
  isSearchUsed: Boolean;
  summary: Summary;
  summaryChildren: Summary[];
  summaryChildrenContinueQuery: {query: { pages: Pages}, continue: {}}[];
  statusSearch: 'idle' | 'loading' | 'failed';
  statusDetails: 'idle' | 'loading' | 'failed';
  statusSummary: 'idle' | 'loading' | 'failed';
  statusSummaryChildren: 'idle' | 'loading' | 'failed';
  statusSummaryChildrenContinueQuery: 'idle' | 'loading' | 'failed';
}

const initialState: SearchState = {
  value: '',
  results: [],
  details: {
    displaytitle: "",
    images: [""],
    links: [{
      ns: 0,
      exists: "",
      "*": "",
    }],
    pageid: 0,
    sections: [], 
    subtitle: "",
    text: {"*": ""},
    title: "",
  },
  isSearchUsed: false,
  summary: {
    extract: '',
    ns: '',
    pageid: 0,
    title: ''
  },
  summaryChildren: [],
  summaryChildrenContinueQuery: [],
  statusSearch: 'idle',
  statusDetails: 'idle',
  statusSummary: 'idle',
  statusSummaryChildren: 'idle',
  statusSummaryChildrenContinueQuery: 'idle',
};

export const searchAsync = createAsyncThunk(
  'search/fetchSearchResults',
  async (searchTerm: string) => {
    const searchResponse = await fetchSearchResults(searchTerm);
    const pageId = searchResponse.query.search[0].pageid;
    const firstArticle = await getArticleResults(pageId);
    const firstSummary = await getArticleSummaryText(pageId);
    return {
      searchResults: searchResponse.query.search,
      firstArticle: firstArticle.parse,
      firstSummary: firstSummary.query.pages[pageId]
    };
  }
);

export const getArticleAsync = createAsyncThunk(
  'search/getArticleResults',
  async (pageId: string) => {
    const response = await getArticleResults(pageId);
    return response.parse;
  }
);

/* This code can search for more than 50 titles and still return results successfully */
export const getArticleSummaryByTitleAsync = createAsyncThunk(
  'search/getArticleSummaryTextByTitle',
  async (titles: string) => {
    // A list of titles to work on.
    // Separate values with | or alternative.
    // Maximum number of values is 50 (500 for clients allowed higher limits).
    let tempTitles = titles;
    let titlePosition = 0;
    const maxTitles = 50;
    const titleArray = titles.split('|');
    if (titleArray.length > maxTitles) {
      tempTitles = titleArray.splice(titlePosition, maxTitles).join('|');
    }
    console.log('a, tempTitles', tempTitles);
    const response = await getArticleSummaryTextByTitle(tempTitles, "");
    console.log('b');
    let continueQuery = [] as any[];
    if (response.continue) {
      console.log('1');
      const continueString = Object.entries(response.continue).map(pair => {
        return `&${pair[0]}=${pair[1]}`;
      }).join('');
      console.log('2');
      continueQuery.push(await getArticleSummaryTextByTitle(tempTitles, continueString));
      console.log('3');
      let count = 0;
      console.log('4');
      console.log(continueQuery[continueQuery.length-1].batchcomplete === "")
      while (!!continueQuery[continueQuery.length-1].continue && count < 30) {
        console.log('making a new api call...', continueQuery[continueQuery.length-1].continue);
        const continueString = Object.entries(continueQuery[continueQuery.length-1].continue).map(pair => {
          return `&${pair[0]}=${pair[1]}`;
        }).join('');
        console.log('the new query string is...', continueString);
        continueQuery.push(await getArticleSummaryTextByTitle(tempTitles, continueString));
        count++;
      }
    }
    console.log('c, continue query...');
    console.log(continueQuery);
    return {
      initial: response.query.pages,
      continueQuery: continueQuery || [],
    };
  }
);

/* this works so long as the initial set of titles to search for is NO MORE THAN 50 TITLES LONG
export const getArticleSummaryByTitleAsyncOld = createAsyncThunk(
  'search/getArticleSummaryTextByTitle',
  async (titles: string) => {
    // A list of titles to work on.
    // Separate values with | or alternative.
    // Maximum number of values is 50 (500 for clients allowed higher limits).
    let tempTitles = titles;
    let titlePosition = 0;
    const maxTitles = 50;
    const titleArray = titles.split('|');
    if (titleArray.length > maxTitles) {
      tempTitles = titleArray.splice(titlePosition, maxTitles).join('|');
    }
    console.log('a, tempTitles', tempTitles);
    const response = await getArticleSummaryTextByTitle(tempTitles, "");
    console.log('b');
    console.log(response);
    let continueQuery = [] as any[];
    if (response.continue) {
      console.log('1');
      const continueString = Object.entries(response.continue).map(pair => {
        return `&${pair[0]}=${pair[1]}`;
      }).join('');
      console.log('2');
      continueQuery.push(await getArticleSummaryTextByTitle(tempTitles, continueString));
      console.log('3');
      let count = 0;
      console.log('4');
      // continueQuery[continueQuery.length-1].batchcomplete !== ""
      console.log(continueQuery[continueQuery.length-1].batchcomplete === "")
      while (!!continueQuery[continueQuery.length-1].continue && count < 30) {
        console.log('making a new api call...', continueQuery[continueQuery.length-1].continue);
        const continueString = Object.entries(continueQuery[continueQuery.length-1].continue).map(pair => {
          return `&${pair[0]}=${pair[1]}`;
        }).join('');
        console.log('the new query string is...', continueString);
        continueQuery.push(await getArticleSummaryTextByTitle(tempTitles, continueString));
        count++;
      }
    }
    console.log('continue query...');
    console.log(continueQuery);
    return {
      initial: response.query.pages,
      continueQuery: continueQuery || [],
    };
  }
);
*/

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
  reducers: {
    toggleSearchUsed: (state) => {
      state.isSearchUsed = !state.isSearchUsed;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchAsync.pending, (state) => {
        state.statusSearch = 'loading';
      })
      .addCase(searchAsync.fulfilled, (state, action) => {
        state.statusSearch = 'idle';
        state.results = action.payload.searchResults;
        state.details = action.payload.firstArticle;
        state.summary = action.payload.firstSummary;
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
      })
      .addCase(getArticleSummaryByTitleAsyncOld.pending, (state) => {
        state.statusSummaryChildren = 'loading';
        state.statusSummaryChildrenContinueQuery = 'loading';
      })
      .addCase(getArticleSummaryByTitleAsyncOld.fulfilled, (state, action) => {
        state.statusSummary = 'idle';
        state.statusSummaryChildrenContinueQuery = 'idle';
        state.summaryChildren = action.payload.initial || [];
        state.summaryChildrenContinueQuery = action.payload.continueQuery || [];
      })
      .addCase(getArticleSummaryByTitleAsync.pending, (state) => {
        state.statusSummaryChildren = 'loading';
        state.statusSummaryChildrenContinueQuery = 'loading';
      })
      .addCase(getArticleSummaryByTitleAsync.fulfilled, (state, action) => {
        state.statusSummary = 'idle';
        state.statusSummaryChildrenContinueQuery = 'idle';
        console.log(action.payload);
        state.summaryChildren = action.payload.initial || [];
        state.summaryChildrenContinueQuery = action.payload.continueQuery || [];
      });
  },
});

export const { toggleSearchUsed } = searchSlice.actions;

export const selectSearchResults = (state: RootState) => state.search.results;
export const selectSummaryResults = (state: RootState) => state.search.summary;
export const selectSummaryChildrenResults = (state: RootState) => state.search.summaryChildren;
export const selectSummaryChildrenContQueryResults = (state: RootState) => state.search.summaryChildrenContinueQuery;
export const selectDetailResults = (state: RootState) => state.search.details;
export const selectIsSearchUsed = (state: RootState) => state.search.isSearchUsed;

export default searchSlice.reducer;
