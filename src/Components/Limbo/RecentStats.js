import React, { Fragment, useState } from 'react';
import { RecorderContext } from '../../Contexts/RecorderProvider';
import { FormartHistory } from '../Common/HistoryPayout';
import { FormatPayout } from '../Common/PayoutComparison';
import { targetList } from '../Common/Targets'

const RecentStats = () => {
    const [targets] = useState(targetList)

    const lastHistory = 100
    const highLightX = 10

    const customPayoutCalc = (result) => result

    return (
        <Fragment>
            <RecorderContext.Consumer>
            {({ limboData }) => (
                <Fragment>
                    <FormartHistory 
                        seedData={limboData} 
                        lastHistory={lastHistory} 
                        highLightX={highLightX} 
                        customPayoutCalc={customPayoutCalc} 
                    />
                    <FormatPayout 
                        seedData={limboData} 
                        targets={targets} 
                        customPayoutCalc={customPayoutCalc} 
                    />
                </Fragment>
            )}
            </RecorderContext.Consumer>
        </Fragment>
    )
}

export default RecentStats;