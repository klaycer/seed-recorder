import React, { Fragment } from 'react';


export const FormartHistory = ({ seedData, lastHistory, highLightX, customPayoutCalc = null}) => {
    let historyResults = [];

    for(let i = 0; i < seedData.count; i++){
        let result = customPayoutCalc(seedData.list[i]?.stake_state?.result);
        historyResults.push(Math.floor((result || 0) * 100) / 100)
    }

    return (
        <HistoryPayout historyResults={historyResults} lastHistory={lastHistory} highLightX={highLightX} />
    )
}

const HistoryPayout = ({ historyResults, lastHistory, highLightX }) => {
    let history = [], len = 0
    for(let k in historyResults){
        if(len === lastHistory)
            break;
        history.push(historyResults[k])
        
        len += 1
    }
    return (
        <div className="mb-5">
            <h1 className="sm:text-1xl text-1xl font-medium title-font mb-3 text-white">
                Last {lastHistory} Results
            </h1>
            <div>
                <table className="crash-table table text-gray-400 border-separate space-y-6 text-xs text-center">
                    <thead>
                        <tr className="bg-gray-800">
                            <th className="p-1 text-gray">Count</th>
                            {history.map((val, index) => 
                                <Fragment key={index+'_history_results_head'}>
                                    <th className="p-1 text-gray">{index+1}</th>
                                </Fragment>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-gray-800">
                            <td className="p-1 text-gray">Payout</td>
                            {history.map((val, index) => 
                                <Fragment key={index+'_history_results'}>
                                    <td className={"p-1 "+(val >= highLightX ? 'bg-green-400 text-white' : '')}>{val}x</td>
                                </Fragment>
                            )}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )

}

export default HistoryPayout;