import React, { createContext, useEffect, useState, useCallback } from 'react';
import { useIndexedDB } from 'react-indexed-db';
import { CrashModel } from '../Model/Crash';
import { LimboModel } from '../Model/Limbo';
import { DiceModel } from '../Model/Dice';
import { SET_SEED_DATA, RECORD_CRASH, RECORD_DICE, RECORD_LIMBO } from '../Constants'

export const RecorderContext = createContext({});

const RecorderProvider = ({ children }) => {
    const crashDB = useIndexedDB(CrashModel.store);
    const limboDB = useIndexedDB(LimboModel.store);
    const diceDB = useIndexedDB(DiceModel.store);

    const [currentCrash, setCurrentCrash] = useState('3de7306e8de178b5f4de0a6eac3635c29b6143d638f8ecdb4bf691e8f9a2ee6a')

    const [crashData, setCrashData] = useState({
        list: [],
        count: 0
    })
    const [limboData, setLimboData] = useState({
        list: [],
        count: 0
    })
    const [diceData, setDiceData] = useState({
        list: [],
        count: 0
    })

    const handleCrashResult = useCallback((newData, count, recentHash) => {
        setCrashData((prevState) => ({
            ...prevState,
            list: [...prevState.list, ...newData],
            count: prevState.count + count
        }))
        if(recentHash !== null){
            setCurrentCrash(recentHash)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [crashData, currentCrash])

    const handleLimboResult = useCallback((newData, count) => {
        setLimboData((prevState) => ({
            ...prevState,
            list: [...prevState.list, ...newData],
            count: prevState.count + count
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limboData])

    const handleDiceResult = useCallback((newData, count) => {
        setDiceData((prevState) => ({
            ...prevState,
            list: [...prevState.list, ...newData],
            count: prevState.count + count
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [crashData])

    function setDataByType(data) {
        switch(data.type){
            case RECORD_CRASH:
                if(data.result){
                    const crashObject = {
                        stake_id: data.result.id
                        , stake_crashpoint: data.result.crashpoint
                        , stake_hash: data.result.hash
                        , stake_seed: data.result.seed
                        , stake_leaderboard: data.result.leaderboard
                        , stake_status: data.result.status
                        , stake_startTime: data.result.startTime
                        , stake_multiplier: data.result.multiplier
                        , stake_nextRoundIn: data.result.nextRoundIn
                        , createdAt: Date.now()
                    }
                    crashDB.add(crashObject).then(
                        event => {
                            // setCurrentCrash(data.result.hash.hash)
                            handleCrashResult([crashObject], 1, data.result.hash.hash)
                            dataSetSuccessful(event)
                        },
                        error => dataSetFailed(error)
                    );
                }
                break;
            case RECORD_LIMBO:
                if(data.result){
                    const limboObject = {
                        stake_id: data.result.id
                        , stake_active: data.result.active
                        , stake_amount: data.result.amount
                        , stake_currency: data.result.currency
                        , stake_amountMultiplier: data.result.amountMultiplier
                        , stake_game: data.result.game
                        , stake_payout: data.result.payout
                        , stake_payoutMultiplier: data.result.payoutMultiplier
                        , stake_state: data.result.state
                        , stake_updatedAt: data.result.updatedAt
                        , stake_user: data.result.user
                        , createdAt: Date.now()
                    }
                    limboDB.add(limboObject).then(
                        event => {
                            handleLimboResult([limboObject], 1)
                            dataSetSuccessful(event)
                        },
                        error => dataSetFailed(error)
                    );
                }
                break;
            case RECORD_DICE:
                if(data.result){
                    const diceObject = {
                        stake_id: data.result.id
                        , stake_active: data.result.active
                        , stake_amount: data.result.amount
                        , stake_currency: data.result.currency
                        , stake_amountMultiplier: data.result.amountMultiplier
                        , stake_game: data.result.game
                        , stake_payout: data.result.payout
                        , stake_payoutMultiplier: data.result.payoutMultiplier
                        , stake_state: data.result.state
                        , stake_updatedAt: data.result.updatedAt
                        , stake_user: data.result.user
                        , createdAt: Date.now()
                    }
                    diceDB.add(diceObject).then(
                        event => {
                            handleDiceResult([diceObject], 1)
                            dataSetSuccessful(event)
                        },
                        error => dataSetFailed(error)
                    );
                }
                break;
            default:
                break;
        }
    }

    const dataSetSuccessful = (event) => {
        // console.log('Bet Recorded: ', event);
    }

    const dataSetFailed = (error) => {
        // console.log(error);
    }

    useEffect(() => {
        window.addEventListener("message", function(event) {
          if (event.source !== window) return;
          if(event.data.type !== undefined){
            switch(event.data.type){
              case SET_SEED_DATA:
                  setDataByType(event.data.data);
                break;
              default:
                break;
            }
          }
        });

        (async function() {
            let crashIds = {}, limboIds = {}, diceIds = {};
            await crashDB.getAll().then(crashFromDB => {
                const lastestHash = (crashFromDB || []).length - 1;
                const crachCount = (crashFromDB.filter(c => {
                    return crashIds.hasOwnProperty(c.stake_id) ? false : (crashIds[c.stake_id] = c);
                }) || []).length;
                setCrashData((prevState) => ({
                    ...prevState,
                    list: [...prevState.list, ...Object.values(crashIds)],
                    count: prevState.count + crachCount
                }));
                if(lastestHash > -1 && crashFromDB[lastestHash]?.hash?.hash !== undefined){
                    setCurrentCrash(crashFromDB[lastestHash].hash.hash);
                }
            });
            await limboDB.getAll().then(limboFromDB => {
                const limboCount = (limboFromDB.filter(c => {
                    return limboIds.hasOwnProperty(c.stake_id) ? false : (limboIds[c.stake_id] = c);
                }) || []).length;
                setLimboData((prevState) => ({
                    ...prevState,
                    list: [...prevState.list, ...Object.values(limboIds)],
                    count: prevState.count + limboCount
                }));
            });
            await diceDB.getAll().then(diceFromDB => {
                const diceCount = (diceFromDB.filter(c => {
                    return diceIds.hasOwnProperty(c.stake_id) ? false : (diceIds[c.stake_id] = c);
                }) || []).length;
                setDiceData((prevState) => ({
                    ...prevState,
                    list: [...prevState.list, ...Object.values(diceIds)],
                    count: prevState.count + diceCount
                }));
            });
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <RecorderContext.Provider value={{
            currentCrash: currentCrash,
            setCurrentCrash: setCurrentCrash,
            crashData: crashData,
            diceData: diceData,
            limboData: limboData
        }}>
          {children}
        </RecorderContext.Provider>
      );
};
    
export default RecorderProvider;