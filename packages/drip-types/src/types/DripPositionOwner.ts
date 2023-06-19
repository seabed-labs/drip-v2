// This file was automatically generated. DO NOT MODIFY DIRECTLY.
import { PublicKey } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'

export type DirectFields = {
    owner: PublicKey
}
export type DirectValue = {
    owner: PublicKey
}

export interface DirectJSON {
    kind: 'Direct'
    value: {
        owner: string
    }
}

export class Direct {
    static readonly discriminator = 0
    static readonly kind = 'Direct'
    readonly discriminator = 0
    readonly kind = 'Direct'
    readonly value: DirectValue

    constructor(value: DirectFields) {
        this.value = {
            owner: value.owner,
        }
    }

    toJSON(): DirectJSON {
        return {
            kind: 'Direct',
            value: {
                owner: this.value.owner.toString(),
            },
        }
    }

    toEncodable() {
        return {
            Direct: {
                owner: this.value.owner,
            },
        }
    }
}

export interface TokenizedJSON {
    kind: 'Tokenized'
}

export class Tokenized {
    static readonly discriminator = 1
    static readonly kind = 'Tokenized'
    readonly discriminator = 1
    readonly kind = 'Tokenized'

    toJSON(): TokenizedJSON {
        return {
            kind: 'Tokenized',
        }
    }

    toEncodable() {
        return {
            Tokenized: {},
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.DripPositionOwnerKind {
    if (typeof obj !== 'object') {
        throw new Error('Invalid enum object')
    }

    if ('Direct' in obj) {
        const val = obj['Direct']
        return new Direct({
            owner: val['owner'],
        })
    }
    if ('Tokenized' in obj) {
        return new Tokenized()
    }

    throw new Error('Invalid enum object')
}

export function fromJSON(
    obj: types.DripPositionOwnerJSON
): types.DripPositionOwnerKind {
    switch (obj.kind) {
        case 'Direct': {
            return new Direct({
                owner: new PublicKey(obj.value.owner),
            })
        }
        case 'Tokenized': {
            return new Tokenized()
        }
    }
}

export function layout(property?: string) {
    const ret = borsh.rustEnum([
        borsh.struct([borsh.publicKey('owner')], 'Direct'),
        borsh.struct([], 'Tokenized'),
    ])
    if (property !== undefined) {
        return ret.replicate(property)
    }
    return ret
}
