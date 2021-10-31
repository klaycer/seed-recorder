export const LimboModel = {
    store: 'limbo',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
        { name: 'stake_id', keypath: 'stake_id', options: { unique: false } },
        { name: 'stake_active', keypath: 'stake_active', options: { unique: false } },
        { name: 'stake_amount', keypath: 'stake_amount', options: { unique: false } },
        { name: 'stake_currency', keypath: 'stake_currency', options: { unique: false } },
        { name: 'stake_amountMultiplier', keypath: 'stake_amountMultiplier', options: { unique: false } },
        { name: 'stake_game', keypath: 'stake_game', options: { unique: false } },
        { name: 'stake_payout', keypath: 'stake_payout', options: { unique: false } },
        { name: 'stake_payoutMultiplier', keypath: 'stake_payoutMultiplier', options: { unique: false } },
        { name: 'stake_state', keypath: 'stake_state', options: { unique: false } },
        { name: 'stake_updatedAt', keypath: 'stake_updatedAt', options: { unique: false } },
        { name: 'stake_user', keypath: 'stake_user', options: { unique: false } },
        { name: 'createdAt', keypath: 'createdAt', options: { unique: false } }
    ]
}
