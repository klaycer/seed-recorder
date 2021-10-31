(function() {
    var scriptHandlerId1 = '_SeedRecorderScriptId1';
    var scriptHandlerId2 = '_SeedRecorderScriptId2';

    var script1Exists = document.querySelector('[data-id="'+scriptHandlerId1+'"]');
    var script2Exists = document.querySelector('[data-id="'+scriptHandlerId2+'"]');

    if(script1Exists == null){
        var script1 = document.createElement("script");
        script1.setAttribute("data-id", scriptHandlerId1);
        script1.innerHTML = `
        var seedRoorderBetApi = 'https://api.stake.com/graphql';

        (function(ns, fetch){
            if(typeof fetch !== 'function') return;
        
            ns.fetch = function() {
                var out = fetch.apply(this, arguments);

                const fetchArgs = arguments;

                out.then(r => {
                    if(seedRoorderBetApi == fetchArgs[0] && fetchArgs[1] &&
                        fetchArgs[1]?.body !== undefined){
                        r.clone().json().then((obj) => {
                            let result = null, type = null;
                            if(obj?.data?.diceRoll){
                                result = obj?.data?.diceRoll
                                type = 'RECORD_DICE'
                            }
                            else if(obj?.data?.limboBet){
                                result = obj?.data?.limboBet
                                type = 'RECORD_LIMBO'
                            }
                            else if(obj?.data?.crashGame){
                                result = obj?.data?.crashGame
                                type = 'RECORD_CRASH'
                            }

                            if(result !== null && type !== null){
                                window.postMessage({type: 'SET_SEED_DATA', data: {type: type, result: result} }, '*');
                            }
                        })
                    }
                });
                return out;
            }
        }(window, window.fetch));`;
        document.body.appendChild(script1);
    }
    else{
        console.log('foreground script 1 already activated')
    }



    if(script2Exists !== null){
        script2Exists.parentNode.removeChild(script2Exists)
        console.log('foreground script 2 removed')
    }
    var script2 = document.createElement("script");
    script2.setAttribute("data-id", scriptHandlerId2);
    script2.innerHTML = `
    var seedRoorderBetApi = 'https://api.stake.com/graphql';
    if(window._websockets !== null && Array.isArray(window._websockets)){
        for(let k = 0; k < window._websockets.length; k++){
            window._websockets[k].hooks = {
                beforeSend: data => data,
                beforeReceive: data => {
                    try{
                        const crashData = JSON.parse(data.data)
                        if((crashData?.payload?.data?.crash?.event?.status || "") === "crash"){
                            const eventId = crashData?.payload?.data?.crash?.event?.id || null
                            if(eventId !== null){
                                fetch(seedRoorderBetApi, {
                                    "headers": {
                                        "accept": "*/*",
                                        "accept-language": "en-GB,en;q=0.9",
                                        "content-type": "application/json",
                                    },
                                    "referrer": "https://stake.com/",
                                    "referrerPolicy": "strict-origin-when-cross-origin",
                                    "body": JSON.stringify(
                                        {
                                            operationName: "CrashGameLookup",
                                            query: "query CrashGameLookup($gameId: String!) {  crashGame(gameId: $gameId) {    seed {      id      seed      __typename    }    hash {      id      hash      number      __typename    }   ...MultiplayerCrash    leaderboard {      ...MultiplayerCrashBet      __typename    }    __typename }} fragment MultiplayerCrash on MultiplayerCrash {  id  status  multiplier  startTime  nextRoundIn  crashpoint  elapsed  timestamp  cashedIn {    id    user {      id      name      __typename    }    payoutMultiplier    gameId    amount    payout    currency    result    updatedAt    cashoutAt   btcAmount: amount(currency: btc)    __typename  }  cashedOut {    id    user {      id      name     __typename    }    payoutMultiplier    gameId    amount    payout    currency    result    updatedAt    cashoutAt    btcAmount: amount(currency: btc)    __typename  }} fragment MultiplayerCrashBet on MultiplayerCrashBet {  id  user {    id    name   __typename  }  payoutMultiplier  gameId amount  payout currency  result  updatedAt  cashoutAt  btcAmount: amount(currency: btc)}",
                                            variables: {gameId: eventId}
                                        }
                                    ),
                                    "method": "POST",
                                    "mode": "cors",
                                    "credentials": "omit"
                                });
                            }
                        }
                    }
                    catch(err){}
                    return data
                }
            };
        }
    }
    `;
    document.body.appendChild(script2);
    console.log('foreground script 2 added')
}());