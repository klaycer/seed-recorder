import React, { Fragment } from 'react';


export const FormatPayout = ({ seedData, targets, customPayoutCalc }) => {
    let results = [], targetResults = [];

    for(let i = 0; i < seedData.count; i++){
        let result = customPayoutCalc(seedData.list[i]?.stake_state?.result);
        results.push(Math.floor((result || 0) * 100) / 100)
    }

    for(let k = 0; k < targets.length; k++){
        const target = targets[k];
        let hits = 0;
        for(let j in results){
            if(results[j] >= target)
                hits += 1;
        }
        const expectedHitRate = parseFloat((((100/target) * 0.99) / 100).toFixed(7));
        const hitRate = parseFloat((hits / seedData.count).toFixed(7));
        const expectedHits = parseFloat((expectedHitRate * seedData.count).toFixed(7));
        const expectedHitsVsHits = parseFloat((hits - expectedHits).toFixed(7));
        const expectedHitRateVsHitRate =  parseFloat((hitRate - expectedHitRate).toFixed(7));

        targetResults[target] = {
            expectedHitRate: expectedHitRate,
            hitRate: hitRate,
            expectedHits: expectedHits,
            hits: hits,
            expectedHitsVsHits: expectedHitsVsHits,
            expectedHitRateVsHitRate: expectedHitRateVsHitRate
        }
    }

    return <PayoutComparison targetResults={targetResults} targets={targets} sampleSize={seedData.count}/>
}

const PayoutComparison = ({ targets, targetResults, sampleSize }) => {

    const DrawPayoutTable = ({ chunk, multi }) => {
        let init_count = 0, multi_count = 0
        const headElem = (val, col) => <th colSpan={col} key={val+'_th'} className="p-1">{val}x</th>
        return (
            <Fragment>
                <div className="overflow-auto lg:overflow-visible mb-5">
                    <table className="crash-table table text-gray-400 border-separate space-y-6 text-xs text-center">
                        <thead className="bg-gray-800 text-gray-500">
                            <tr>
                                <th className="p-1">{chunk[0]}x to {chunk[chunk.length -1]}x</th>
                                {chunk.map((val, index) => {
                                    if(index === 0){
                                        return headElem(val, multi)
                                    }

                                    init_count += 1
                                    multi_count += 1
                                    if (init_count === multi){
                                        multi_count = 0
                                        return headElem(val, 10)
                                    }
                                    if(multi_count === 10){
                                        multi_count = 0
                                        return headElem(val, 10)
                                    }
                                    return <Fragment key={val+'_th'}></Fragment>
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-gray-800">
                                <td className="p-3">Payout</td>
                                {chunk.map((val, index) => {
                                    return (
                                        <td key={val+'_td_1'} className="td-ltr p-1">{val}x</td>
                                    )
                                })}
                            </tr>
                            {/* <tr className="bg-gray-800">
                                <td className="p-1">Exp Hits</td>
                                {chunk.map((val, index) => {
                                    return (
                                        <td key={val+'_td_2'} className="td-ltr p-1">{Math.round(targetResults[val]?.expectedHits) || 0}</td>
                                    )
                                })}
                            </tr>
                            <tr className="bg-gray-800">
                                <td className="p-1">Act Hits</td>
                                {chunk.map((val, index) => {
                                    return (
                                        <td key={val+'_td_3'} className="td-ltr p-1">{Math.round(targetResults[val]?.hits) || 0}</td>
                                    )
                                })}
                            </tr> */}
                            <tr className="bg-gray-800">
                                <td className="p-1">Variance</td>
                                {chunk.map((val, index) => {
                                    const res = Math.round(targetResults[val]?.expectedHitsVsHits) || 0
                                    return (
                                        <td key={val+'_td_4'} className={(res < 0 ? 'bg-red-500' : (res === 0 ? '' : 'bg-green-500')) +' text-white td-rt p-1'}>{res}</td>
                                    )
                                })}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Fragment>
        )
    }

    const RenderTargets = () => {
        const valuesList = [
            {
                list: targets.slice(0, 99),
                multi: 9
            },
            {
                list: targets.slice(99, 198),
                multi: 8
            },
            {
                list: targets.slice(198, 297),
                multi: 9
            }
        ]

        return (
            <div>
                <h1 className="sm:text-1xl text-1xl font-medium title-font mb-3 text-white">
                    Payouts Comparison - {sampleSize} Sample Size
                </h1>
                {valuesList.map((val, index) => 
                    <Fragment key={index+'_table'}><DrawPayoutTable chunk={val.list} multi={val.multi}/></Fragment>
                )}
            </div>
        )
    }

    return <RenderTargets />
}

export default PayoutComparison;