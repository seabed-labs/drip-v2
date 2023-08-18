import {
    DripPosition,
    DripPositionSigner,
    GlobalConfig,
    GlobalConfigSigner,
    PairConfig,
} from '@dcaf/drip-types';
import { PublicKey } from '@solana/web3.js';

import {
    DripPosition as DripPositionDb,
    DripPositionSigner as DripPositionSignerDb,
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
        globalConfig: accountJson.globalConfig,
        pairConfig: accountJson.pairConfig,
        inputTokenAccount: accountJson.inputTokenAccount,
        outputTokenAccount: accountJson.outputTokenAccount,
        maxSlippageBps: accountJson.maxSlippageBps,
        maxPriceDeviationBps: accountJson.maxPriceDeviationBps,
        dripFeeBps: accountJson.dripFeeBps,
        dripPositionNftMint: accountJson.dripPositionNftMint,
        // TODO: Remove
        autoCreditEnabled: true,
        // TODO: Change
        ownerKind: 'Direct',
        ownerValue: accountJson.owner,
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
        dripPosition: accountJson.dripPosition,
        version: accountJson.version,
        bump: accountJson.bump,
    };
}

export function globalConfigSignerAccountToDbModel(
    address: PublicKey,
    a: GlobalConfigSigner
): GlobalConfigSignerDb {
    const accountJson = a.toJSON();
    return {
        publicKey: address.toString(),
        globalConfig: accountJson.globalConfig,
        bump: accountJson.bump,
        version: accountJson.version,
    };
}

export function globalConfigAccountToDbModel(
    address: PublicKey,
    a: GlobalConfig
): GlobalConfigDb {
    const accountJson = a.toJSON();
    return {
        publicKey: address.toString(),
        version: accountJson.version,
        globalConfigSigner: accountJson.globalConfigSigner,
        superAdmin: accountJson.superAdmin,
        admins: accountJson.admins,
        defaultDripFeeBps: accountJson.defaultDripFeeBps,
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
        globalConfig: accountJson.globalConfig,
        version: accountJson.version,
        bump: accountJson.bump,
        inputTokenMint: accountJson.inputTokenMint,
        outputTokenMint: accountJson.outputTokenMint,
        defaultPairDripFeeBps: accountJson.defaultPairDripFeeBps,
        inputTokenDripFeePortionBps: accountJson.inputTokenDripFeePortionBps,
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
