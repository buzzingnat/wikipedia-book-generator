import React, { useState } from 'react';
import classnames from 'classnames';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    selectDetailResults,
    selectSummaryResults,
} from '../search/searchSlice';
import styles from './Article.module.scss';

export function Article() {
    const detailResults = useAppSelector(selectDetailResults);
    const summaryResults = useAppSelector(selectSummaryResults);
    const dispatch = useAppDispatch();

    console.log({detailResults});
    console.log({summaryResults});

    // if (detailResults?.links?.length > 0) {
    //     // only look at namespaces (ns) of 0
    // }

    return (
        <div className={classnames(styles.article)}>
            <h2>{summaryResults.title}</h2>
            <main>{summaryResults.extract}</main>
        </div>
    );
}
