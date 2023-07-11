import { dedupeInstructionsPublicKeys, notEmpty, paginate } from '../src/utils';
import { Keypair, TransactionInstruction } from '@solana/web3.js';

describe('Utils', () => {
    describe('paginate', () => {
        test('should paginate once', async () => {
            let paginateCalled = false;
            const arr = ['1', '2', '3'];
            await paginate(
                arr,
                async (items: string[]) => {
                    expect(items).toStrictEqual(arr);
                    paginateCalled = true;
                },
                4
            );
            expect(paginateCalled).toEqual(true);
        });
        test('should paginate twice', async () => {
            let paginateCalledTimes = 0;
            const arr = ['1', '2'];
            const expectedCalls = [['1'], ['2']];
            await paginate(
                arr,
                async (items: string[]) => {
                    expect(items).toStrictEqual(expectedCalls[0]);
                    expectedCalls.shift();
                    paginateCalledTimes += 1;
                },
                1
            );
            expect(paginateCalledTimes).toEqual(2);
        });
        test('should with last pagination length smaller than page size', async () => {
            let paginateCalledTimes = 0;
            const arr = ['1', '2', '3', '4', '5'];
            const expectedCalls = [['1', '2'], ['3', '4'], ['5']];
            await paginate(
                arr,
                async (items: string[]) => {
                    expect(items).toStrictEqual(expectedCalls[0]);
                    expectedCalls.shift();
                    paginateCalledTimes += 1;
                },
                2
            );
            expect(paginateCalledTimes).toEqual(3);
        });
    });

    describe('dedupeInstructionsPublicKeys', () => {
        test('should return empty list for empty input', function () {
            expect(dedupeInstructionsPublicKeys([]).length).toEqual(0);
        });
        test('should return empty list for instructions with no keys', function () {
            const ix = new TransactionInstruction({
                keys: [],
                programId: new Keypair().publicKey,
            });
            expect(dedupeInstructionsPublicKeys([ix, ix]).length).toEqual(0);
        });
        test('should dedupe keys from a single ix', function () {
            const pubkey = new Keypair().publicKey;
            const ix = new TransactionInstruction({
                keys: [
                    {
                        pubkey,
                        isSigner: false,
                        isWritable: false,
                    },
                    {
                        pubkey,
                        isSigner: true,
                        isWritable: false,
                    },
                ],
                programId: new Keypair().publicKey,
            });
            const res = dedupeInstructionsPublicKeys([ix]);
            expect(res.length).toEqual(1);
            expect(res.map((p) => p.toString())).toEqual([pubkey.toString()]);
        });
        test('should dedupe keys from multiple ixs', function () {
            const pubkey1 = new Keypair().publicKey;
            const pubkey2 = new Keypair().publicKey;
            const ix = new TransactionInstruction({
                keys: [
                    {
                        pubkey: pubkey1,
                        isSigner: false,
                        isWritable: false,
                    },
                    {
                        pubkey: pubkey2,
                        isSigner: true,
                        isWritable: false,
                    },
                ],
                programId: new Keypair().publicKey,
            });
            const res = dedupeInstructionsPublicKeys([ix, ix]);
            expect(res.length).toEqual(2);
            expect(res.map((p) => p.toString())).toEqual([
                pubkey1.toString(),
                pubkey2.toString(),
            ]);
        });
    });
    describe('notEmpty', () => {
        test('should filter out undefined', () => {
            expect(['1', '2', '3', undefined, '4'].filter(notEmpty)).toEqual([
                '1',
                '2',
                '3',
                '4',
            ]);
        });
        test('should filter out null', () => {
            expect(['1', '2', '3', null, '4'].filter(notEmpty)).toEqual([
                '1',
                '2',
                '3',
                '4',
            ]);
        });
        test('should not filter out empty strings', () => {
            expect(['1', '2', '3', '', '4'].filter(notEmpty)).toEqual([
                '1',
                '2',
                '3',
                '',
                '4',
            ]);
        });
        test('should not filter out 0', () => {
            expect([1, 2, 3, 0, 4].filter(notEmpty)).toEqual([1, 2, 3, 0, 4]);
        });
        test('should not filter out negative values', () => {
            expect([1, 2, 3, -1, 4].filter(notEmpty)).toEqual([1, 2, 3, -1, 4]);
        });
    });
});
