import {
    DripPosition,
    DripPositionNftMapping,
    DripPositionSigner,
    GlobalConfig,
    GlobalConfigSigner,
    PairConfig,
} from '@dcaf/drip-types';
import { PublicKey } from '@solana/web3.js';

import {
    DripPosition as DripPositionDb,
    DripPositionSigner as DripPositionSignerDb,
    DripPositionNftMapping as DripPositionNftMappingDb,
    GlobalConfigSigner as GlobalConfigSignerDb,
    GlobalConfig as GlobalConfigDb,
    PairConfig as PairConfigDb,
} from '../generated/prismaClient';
import { Decimal } from '../generated/prismaClient/runtime/library';

// TODO: This is duplicated in dripper
// Create Internal lib to share code
export function notEmpty<TValue>(
    value: TValue | null | undefined
): value is TValue {
    return value !== null && value !== undefined;
}

export function dripPositionAccountToDbModel(
    address: PublicKey,
    a: DripPosition
): DripPositionDb {
    const accountJson = a.toJSON();
    return {
        publicKey: address.toString(),
        ...accountJson,
        ownerKind: accountJson.owner.kind,
        ownerValue:
            'value' in accountJson.owner ? accountJson.owner.value.owner : null,
        dripAmountPreFees: new Decimal(accountJson.dripAmountPreFees),
        dripAmountRemainingPostFeesInCurrentCycle: new Decimal(
            accountJson.dripAmountRemainingPostFeesInCurrentCycle
        ),
        dripInputFeesRemainingForCurrentCycle: new Decimal(
            accountJson.dripInputFeesRemainingForCurrentCycle
        ),
        totalInputFeesCollected: new Decimal(
            accountJson.totalInputFeesCollected
        ),
        totalOutputFeesCollected: new Decimal(
            accountJson.totalOutputFeesCollected
        ),
        totalInputTokenDrippedPostFees: new Decimal(
            accountJson.totalInputTokenDrippedPostFees
        ),
        totalOutputTokenReceivedPostFees: new Decimal(
            accountJson.totalOutputFeesCollected
        ),
        frequencyInSeconds: new Decimal(accountJson.frequencyInSeconds),
        dripMaxJitter: accountJson.dripMaxJitter,
        dripActivationGenesisShift: Number(
            accountJson.dripActivationGenesisShift
        ),
        dripActivationTimestamp: new Date(
            Number(accountJson.dripActivationTimestamp) * 1000
        ),
        cycle: new Decimal(accountJson.cycle),
    };
}

export function dripPositionSignerAccountToDbModel(
    address: PublicKey,
    a: DripPositionSigner
): DripPositionSignerDb {
    const accountJson = a.toJSON();
    return {
        publicKey: address.toString(),
        ...accountJson,
    };
}

export function dripPositionNftMappingAccountToDbModel(
    address: PublicKey,
    a: DripPositionNftMapping
): DripPositionNftMappingDb {
    const accountJson = a.toJSON();
    return {
        publicKey: address.toString(),
        ...accountJson,
    };
}

export function globalConfigSignerAccountToDbModel(
    address: PublicKey,
    a: GlobalConfigSigner
): GlobalConfigSignerDb {
    const accountJson = a.toJSON();
    return {
        publicKey: address.toString(),
        ...accountJson,
    };
}

export function globalConfigAccountToDbModel(
    address: PublicKey,
    a: GlobalConfig
): GlobalConfigDb {
    const accountJson = a.toJSON();
    return {
        publicKey: address.toString(),
        ...accountJson,
        adminPermissions: accountJson.adminPermissions.map(
            (p) => new Decimal(p)
        ),
    };
}

export function pairConfigAccountToDbModel(
    address: PublicKey,
    a: PairConfig
): PairConfigDb {
    const accountJson = a.toJSON();
    return {
        publicKey: address.toString(),
        ...accountJson,
        inputTokenPriceOracleKind: accountJson.inputTokenPriceOracle.kind,
        inputTokenPriceOracleValue:
            'value' in accountJson.inputTokenPriceOracle
                ? accountJson.inputTokenPriceOracle.value.pythPriceFeedAccount
                : null,
        outputTokenPriceOracleKind: accountJson.outputTokenPriceOracle.kind,
        outputTokenPriceOracleValue:
            'value' in accountJson.outputTokenPriceOracle
                ? accountJson.outputTokenPriceOracle.value.pythPriceFeedAccount
                : null,
    };
}
