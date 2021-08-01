import React, { useState } from 'react';
import classnames from 'classnames';
import search from './../../search.svg';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    searchAsync,
    selectSearchResults,
} from './searchSlice';
import styles from './Search.module.scss';

export function Search() {
    const searchResults = useAppSelector(selectSearchResults);
    const dispatch = useAppDispatch();
    const [inputValue, setInputValue] = useState('');

    return (
        <div>
            <div className={styles.row}>
                <form className={styles.search_container}>
                    <input
                      type="text"
                      id="search_bar"
                      className={styles.search_input}
                      placeholder="Search Wikipedia for an article..."
                      value={inputValue}
                      onChange={(event) => (
                        setInputValue(event.target.value)
                      )}
                    />
                    <button
                      onClick={(event) => {
                        event.preventDefault();
                        dispatch(searchAsync(inputValue))
                      }}
                    >
                        <img
                            src={search}
                            className={styles.search_icon}
                            alt="search"
                        />
                    </button>
                </form>
            </div>
            <div className={classnames(styles.left_align)}>
                Make a book from...
                <dl className={styles.flex}>
                    {searchResults.map((result) => (
                        <div
                            key={result.pageid}
                            className={styles.definition_wrapper}
                            onClick={(event) => {
                              console.log(
                                  'clicked on',
                                  result.pageid,
                                  result.title
                              );
                              // make api call to get data to get pdf/book contents
                            }}
                        >
                            <span
                                title={
                                    result.snippet
                                        .replace(/<[^>]*>/g, '')
                                }
                            >
                                {result.title}
                            </span>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    );
}
