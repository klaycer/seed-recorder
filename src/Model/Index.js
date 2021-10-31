import { CrashModel } from './Crash'
import { LimboModel } from './Limbo'
import { DiceModel } from './Dice'

export const DBConfig = {
    name: 'SeedRecorder',
    version: 1,
    objectStoresMeta: [
        CrashModel,
        LimboModel,
        DiceModel
    ]
};