import React, { useState } from 'react';
import classnames from 'classnames';
import search from './../../search.svg';
import { md5 } from 'hash-wasm';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    getArticleAsync,
    getSummaryTextAsync,
    searchAsync,
    selectIsSearchUsed,
    selectSearchResults,
    toggleSearchUsed,
} from './searchSlice';
import styles from './Search.module.scss';

export function Search() {
    const searchResults = useAppSelector(selectSearchResults);
    const isSearchUsed = useAppSelector(selectIsSearchUsed);
    const dispatch = useAppDispatch();
    const [inputValue, setInputValue] = useState('');
    const [imageHashes, setImageHashes] = useState<Record<string, string>>({});

    const imageUrl: string = 'Red_Pencil_Icon.png';

    if (!imageHashes.imageUrl) {
        md5(imageUrl).then(result => {
            const tempImageHashes: Record<string, string> = JSON.parse(JSON.stringify(imageHashes));
            tempImageHashes.imageUrl = result;
            setImageHashes(tempImageHashes);
        });
    }


    return (
        <div>
            <div className={isSearchUsed ? classnames(styles.search_header, styles.animate) : styles.row}>
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
                        if (!inputValue) {
                            return;
                        }
                        dispatch(searchAsync(inputValue));
                        if (!isSearchUsed) {
                            dispatch(toggleSearchUsed());
                        }
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
            <div className={isSearchUsed ? classnames(styles.search_header_links, styles.did_you_mean, styles.fade) : classnames(styles.search_header_links, styles.hidden)}>
                {false && <img src={`https://upload.wikimedia.org/wikipedia/commons/${
                    imageHashes?.imageUrl?.substring(0, 1) || '0'
                }/${
                    imageHashes?.imageUrl?.substring(0, 2) || '00'
                }/${
                    imageUrl
                }`} /> /* this is a mock up of inserting images from wikimedia */}
                <span className={styles.helper_text}>Did you mean...</span>
                <dl className={styles.flex}>
                    {searchResults.map((result) => (
                        <div
                            key={result.pageid}
                            className={styles.definition_wrapper}
                            onClick={(event) => {
                                event.preventDefault();
                                // make api call to get data to get pdf/book contents
                                dispatch(getSummaryTextAsync(result.pageid));
                                dispatch(getArticleAsync(result.pageid));
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
