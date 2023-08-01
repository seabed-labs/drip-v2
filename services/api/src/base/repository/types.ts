import { Address } from '@coral-xyz/anchor';

import {
    DripPosition,
    DripPositionNftMapping,
    DripPositionSigner,
    GlobalConfig,
    GlobalConfigSigner,
    PairConfig,
    DripPositionWalletOwner,
} from '../../generated/prismaClient';

// TODO: add support for arbitrary mix-match repo methods
// in the same db transaction
export interface IAccountRepository {
    getDripPositionsForWallet(
        walletPublicKey: Address
    ): Promise<DripPosition[]>;

    upsertDripPosition(a: DripPosition): Promise<DripPosition>;
    upsertDripPositionWalletOwner(
        a: DripPositionWalletOwner
    ): Promise<DripPositionWalletOwner>;
    upsertDripPositionSigner(
        a: DripPositionSigner
    ): Promise<DripPositionSigner>;
    upsertDripPositionNftMapping(
        a: DripPositionNftMapping
    ): Promise<DripPositionNftMapping>;
    upsertGlobalConfigSigner(
        a: GlobalConfigSigner
    ): Promise<GlobalConfigSigner>;
    upsertGlobalConfig(a: GlobalConfig): Promise<GlobalConfig>;
    upsertPairConfig(a: PairConfig): Promise<PairConfig>;
}
