import React, { useState, useEffect, Fragment } from 'react';
import CrashResults from '../Utils/CrashResults';
import { RecorderContext } from '../../Contexts/RecorderProvider';
import HistoryPayout from '../Common/HistoryPayout'
import PayoutComparison from '../Common/PayoutComparison';
import { targetList } from '../Common/Targets'

const RecentStats = () => {
    const [serverSeed, setServerSeed] = useState('3de7306e8de178b5f4de0a6eac3635c29b6143d638f8ecdb4bf691e8f9a2ee6a')
    const [clientSeed] = useState('0000000000000000001b34dc6a1e86083f95500b096231436e9b25cbdd0075c4')
    const [firstNonce] = useState(0)
    const [lastNonce] = useState(25000)
    const [results, setResults] = useState(null)

    //state info
    const [targetResults, setTargetResults] = useState({})
    const [historyResults, setHistoryResults] = useState([])
    const [targets] = useState(targetList)

    //misc
    const lastHistory = 100
    const highLightX = 10

    //form
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        setResults(new CrashResults(clientSeed, serverSeed, firstNonce, lastNonce, targets))
    }, [serverSeed, clientSeed, firstNonce, lastNonce, targets])

    useEffect(() => {
        (async function() {
            if(results !== null){
                await results.simulateTargets()
                setTargetResults(results.targetResults)
                setHistoryResults(results.results)
                setLoading(false)
            }
        })()
    }, [results])

    return (
        <RecorderContext.Consumer>
            {({ currentCrash, setCurrentCrash }) => (
            <div>
                <div className="flex w-full">
                    <div className="m-1 flex w-full mb-5">
                        <input 
                            className="rounded-l-lg p-2 border-t mr-0 border-b text-sm border-l text-gray-800 border-gray-200 bg-white h-8 w-full" 
                            value={currentCrash} 
                            onChange={(event) => {
                                setCurrentCrash(event.target.value)
                            }} 
                            placeholder="Sever seed"
                        />
                        <button 
                            disabled={isLoading}
                            className="px-2 rounded-r-lg bg-indigo-400 text-sm text-white font-bold p-1 uppercase h-8"
                            onClick={() => setServerSeed(currentCrash)}
                        >Generate</button>
                    </div>
                </div>
                {results !== null && (targetResults || {}) !== {} && (
                    <Fragment>
                        <HistoryPayout historyResults={historyResults} lastHistory={lastHistory} highLightX={highLightX} />
                        <PayoutComparison targetResults={targetResults} targets={targets} sampleSize={Object.keys(historyResults).length} />
                    </Fragment>
                )}
                {(results === null || (targetResults || {}) === {}) && (
                    <div className="overflow-auto lg:overflow-visible p-2 mb-3">
                        No seed data generated.
                    </div>
                )}
            </div>
            )}
        </RecorderContext.Consumer>
    )
}

export default RecentStats;