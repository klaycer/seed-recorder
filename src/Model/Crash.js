export const CrashModel = {
    store: 'crash',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
        { name: 'stake_id', keypath: 'stake_id', options: { unique: false } },
        { name: 'stake_crashpoint', keypath: 'stake_crashpoint', options: { unique: false } },
        { name: 'stake_hash', keypath: 'stake_hash', options: { unique: false } },
        { name: 'stake_seed', keypath: 'stake_seed', options: { unique: false } },
        { name: 'stake_leaderboard', keypath: 'stake_leaderboard', options: { unique: false } },
        { name: 'stake_status', keypath: 'stake_status', options: { unique: false } },
        { name: 'stake_startTime', keypath: 'stake_startTime', options: { unique: false } },
        { name: 'stake_multiplier', keypath: 'stake_multiplier', options: { unique: false } },
        { name: 'stake_nextRoundIn', keypath: 'stake_nextRoundIn', options: { unique: false } },
        { name: 'createdAt', keypath: 'createdAt', options: { unique: false } }
    ]
}