import React, { useContext } from 'react';
import AppContext from '../data/app-context';

import './AllResultsPage.css';

export default function AllResultsPage() {
    const { state } = useContext(AppContext);
    const { drawings, analytics } = state;
    console.log(state);
    return (
        <div className='allResults'>
            <h2>Tất cả kết quả</h2>
            <br />
            {drawings.map((drawing) => {
                return (
                    <div className='resultByDate mono' key={drawing.drawingId}>
                        {drawing.drawingDate} |{' '}
                        {drawing.drawingResult.split(' ').map((resultNum) => {
                            const count =
                                analytics.resultNumbersAppearanceCount[
                                    resultNum
                                ];
                            return (
                                <>
                                    <span className='resultNum'>
                                        {resultNum}
                                    </span>
                                    <span className='resultNumCount'>
                                        ({count}){'   '}
                                    </span>
                                </>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}
