/*
fetch('/api/books/', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({
		title: 'New Book',
		contents: 'The contents of the book.'
	})
});
*/

import React, { useState } from 'react';
import classnames from 'classnames';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { saveBookAsync, getBooksAsync, selectAllBookResults } from './booksSlice';
import styles from './Books.module.scss';

export function Books() {
	const allBookResults = useAppSelector(selectAllBookResults);
    const dispatch = useAppDispatch();

    React.useEffect(() => {
       dispatch(getBooksAsync())
    }, [dispatch])

    return (
        <div className={styles.library_container}>
            <div className={classnames(styles.library_header)}>
                <h2>Saved Books</h2>
	            <button
	              onClick={(event) => {
	                event.preventDefault();
	                dispatch(saveBookAsync({title: 'test title', contents: 'test contents'}));
	              }}
	            >
	              Save
	            </button>
            </div>
        	<ul className={styles.library_list}>
            	{/*OUTPUT ALL BOOKS HERE*/
            	allBookResults.map((book:any) => (
            		<li>
            		    <span className={styles.book_title}>
            		        {book.title}:&nbsp;
            		    </span>
            		    <span className={styles.book_opening}>
            		        {book.contents.substring(0, 100)}...
            		    </span>
            		</li>
            	))}
        	</ul>
        </div>
    );
}
