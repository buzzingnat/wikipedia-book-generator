import React from 'react';
import logo from './logo.svg';
import classnames from 'classnames';

import { useAppSelector, useAppDispatch } from './app/hooks';
import { Article } from './features/article/Article';
import { Search } from './features/search/Search';
import { Books } from './features/books/Books';
import { selectIsSearchUsed } from './features/search/searchSlice';
import styles from './App.module.scss';

function App() {
  const isSearchUsed = useAppSelector(selectIsSearchUsed);
  
  return (
    <div className={styles.App}>
      <header className={
        isSearchUsed
        ? classnames(styles.App_header, styles.App_header_navbar, styles.translate)
        : styles.App_header
      }>
        <h1>Wikipedia Book Generator</h1>
        <div className={styles.search_container}>
          <Search />
        </div>
      </header>
      <div className={styles.content_container}>
      {isSearchUsed && (
          <React.Fragment>
            <Article />
            <Books />
          </React.Fragment>
      )}
      </div>
    </div>
  );
}

export default App;
