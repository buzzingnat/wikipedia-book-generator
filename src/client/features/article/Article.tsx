import React, { useState } from 'react';
import classnames from 'classnames';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    getArticleSummaryByTitleAsync,
    selectDetailResults,
    selectSummaryResults,
    selectSummaryChildrenResults,
    selectSummaryChildrenContQueryResults,
} from '../search/searchSlice';
import styles from './Article.module.scss';

export function Article() {
    const detailResults = useAppSelector(selectDetailResults);
    const summaryResults = useAppSelector(selectSummaryResults);
    const summaryChildrenResults = useAppSelector(selectSummaryChildrenResults);
    const summaryChildrenContQueryResults = useAppSelector(selectSummaryChildrenContQueryResults);
    const dispatch = useAppDispatch();
    const [linkList, setLinkList] = useState([] as string[]);

    const formattedSummaryChildren = Object.values(summaryChildrenResults);
    const formattedSummaryChildrenContQuery = Object.values(summaryChildrenContQueryResults);

    React.useEffect(() => {
        if (detailResults?.text && detailResults?.links?.length > 0) {
            const tempLinks = [] as string[];

            // pull out only the paragraphs
            const paragraphRegEx = /(<p>.*\n*<\/p>)/g;
            const paraMatches = [...detailResults.text['*'].matchAll(paragraphRegEx)];
            const paragraphs = paraMatches.map(match => match[1]);

            // regex that also pulls out text from summary that includes link: /<a href=\"\/wiki\/(\w+)\".*?">(.*?)<\/a>/g;
            // do regex matching on the paragraphs to find links
            const linkRegEx = /<a href=\"\/wiki\/(\w+)\"/g;
            const linkMatches = [...paragraphs.join('').matchAll(linkRegEx)];
            linkMatches.forEach(match => tempLinks.push(match[1]));

            const deduplicateSet = new Set(tempLinks);
            const deduplicateArray = [...deduplicateSet];

            if (deduplicateArray.length === linkList.length) {
                for (let i = 0; i < deduplicateArray.length; i++) {
                    if (deduplicateArray[i] !== linkList[i]) {
                        dispatch(getArticleSummaryByTitleAsync(deduplicateArray.join('|')));
                        setLinkList(deduplicateArray);
                        break;
                    }
                }
            } else {
                dispatch(getArticleSummaryByTitleAsync(deduplicateArray.join('|')));
                setLinkList(deduplicateArray);
            }
        }
    }, [detailResults]);

    return (
        <div className={classnames(styles.article)}>
            <h1>{summaryResults.title}</h1>
                <ul className={styles.table_of_contents}>
                    {linkList.map(link => {
                        const text = link.split('_');
                        const newText = text
                            .map(word => {
                                return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
                            })
                            .join(' ');
                        return (
                            <li key={link} onClick={(event) => {
                                event.preventDefault();
                                console.log('you clicked on', link);
                            }}>
                                {newText}
                            </li>
                        );
                    })}
                </ul>
            <main>
                <h2>{summaryResults.title}</h2>
                {summaryResults.extract.split('\n').map(text => <p key={Math.trunc(Math.random()*100000)}>{text}</p>)}
                {formattedSummaryChildren.map((summary, index) => {
                    console.log('pageId', summary.pageid);
                    let extract = ['']; 
                    if (summary.extract) {
                        extract = summary.extract.split('\n');
                    } else {
                        for (let i = 0; i < formattedSummaryChildrenContQuery.length; i++) {
                            console.log('displaying continued info', formattedSummaryChildrenContQuery[i].query.pages[summary.pageid+'']);
                            if (formattedSummaryChildrenContQuery[i].query.pages[summary.pageid+''].extract) {
                                console.log('extract exists!');
                                extract = formattedSummaryChildrenContQuery[i].query.pages[summary.pageid+''].extract.split('\n');
                            } else {
                                console.log('keep looking...');
                            }
                            // extract = formattedSummaryChildrenContQuery[i].query.pages[summary.pageid+''].extract.split('\n');
                        }
                    }
                    if (extract[0] === '') {
                        console.log(`\n\nNO EXTRACT FOUND FOR ${summary.title}\n\n`);
                    }
                    return (
                        <React.Fragment key={summary.title}>
                            <h2>{summary.title}</h2>
                            {extract.map(text => <p key={Math.trunc(Math.random()*100000)}>{text}</p>)}
                        </React.Fragment>
                    );
                })}
            </main>
        </div>
    );
}
