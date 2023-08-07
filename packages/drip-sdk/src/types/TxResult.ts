import { AnchorErrors, CustomErrors } from '@dcaf/drip-types';

type DripError = CustomErrors.CustomError;
type AnchorError = AnchorErrors.AnchorError;

export type TxSuccessful<T> = {
    value: T;
    txSignature: string;
};

export type TxFailed = {
    error: DripError | AnchorError | Error;
    txSignature?: string;
};

export type TxResult<T> = TxSuccessful<T> | TxFailed;

export function isTxSuccessful<T>(tx: TxResult<T>): tx is TxSuccessful<T> {
    return (tx as TxFailed | undefined)?.error === undefined;
}
