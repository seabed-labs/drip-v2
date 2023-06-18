import { PublicKey } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'

export interface UnavailableJSON {
    kind: 'Unavailable'
}

export class Unavailable {
    static readonly discriminator = 0
    static readonly kind = 'Unavailable'
    readonly discriminator = 0
    readonly kind = 'Unavailable'

    toJSON(): UnavailableJSON {
        return {
            kind: 'Unavailable',
        }
    }

    toEncodable() {
        return {
            Unavailable: {},
        }
    }
}

export type PythFields = {
    pythPriceFeedAccount: PublicKey
}
export type PythValue = {
    pythPriceFeedAccount: PublicKey
}

export interface PythJSON {
    kind: 'Pyth'
    value: {
        pythPriceFeedAccount: string
    }
}

export class Pyth {
    static readonly discriminator = 1
    static readonly kind = 'Pyth'
    readonly discriminator = 1
    readonly kind = 'Pyth'
    readonly value: PythValue

    constructor(value: PythFields) {
        this.value = {
            pythPriceFeedAccount: value.pythPriceFeedAccount,
        }
    }

    toJSON(): PythJSON {
        return {
            kind: 'Pyth',
            value: {
                pythPriceFeedAccount:
                    this.value.pythPriceFeedAccount.toString(),
            },
        }
    }

    toEncodable() {
        return {
            Pyth: {
                pyth_price_feed_account: this.value.pythPriceFeedAccount,
            },
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.PriceOracleKind {
    if (typeof obj !== 'object') {
        throw new Error('Invalid enum object')
    }

    if ('Unavailable' in obj) {
        return new Unavailable()
    }
    if ('Pyth' in obj) {
        const val = obj['Pyth']
        return new Pyth({
            pythPriceFeedAccount: val['pyth_price_feed_account'],
        })
    }

    throw new Error('Invalid enum object')
}

export function fromJSON(obj: types.PriceOracleJSON): types.PriceOracleKind {
    switch (obj.kind) {
        case 'Unavailable': {
            return new Unavailable()
        }
        case 'Pyth': {
            return new Pyth({
                pythPriceFeedAccount: new PublicKey(
                    obj.value.pythPriceFeedAccount
                ),
            })
        }
    }
}

export function layout(property?: string) {
    const ret = borsh.rustEnum([
        borsh.struct([], 'Unavailable'),
        borsh.struct([borsh.publicKey('pyth_price_feed_account')], 'Pyth'),
    ])
    if (property !== undefined) {
        return ret.replicate(property)
    }
    return ret
}
