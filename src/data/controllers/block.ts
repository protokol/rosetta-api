import { Controller } from "@arkecosystem/core-api";
import { Container, Contracts, Utils as AppUtils } from "@arkecosystem/core-kernel";
import { Enums } from "@arkecosystem/crypto";
import Hapi from "@hapi/hapi";

import { BlockResource, Transaction } from "../resources/block";
import { ErrorType } from "../resources/network";

@Container.injectable()
export class BlockController extends Controller {
    @Container.inject(Container.Identifiers.BlockHistoryService)
    private readonly blockHistoryService!: Contracts.Shared.BlockHistoryService;

    public async block(request: Hapi.Request): Promise<BlockResource | ErrorType> {
        const block = await this.blockHistoryService.findOneByCriteriaJoinTransactions(
            { height: request.payload.block_identifier.index },
            {},
        );
        const blockHeight = block!.data.height;
        const blockHash = block!.data.id!;
        const blockTransactions: Transaction[] = [];
        for (const trx of block!.transactions) {
            // currently supports only this 3 transaction types, because they are all in genesis block
            let type: string;
            let address: string | undefined;
            let amount: string | undefined;
            if (trx.type === Enums.TransactionType.Transfer) {
                type = "transfer";
                address = trx.recipientId;
                amount = trx.amount.toFixed();
            }
            if (trx.type === Enums.TransactionType.DelegateRegistration) {
                type = "delegateRegistration";
            }
            if (trx.type === Enums.TransactionType.Vote) {
                type = "vote";
            }
            const transaction: Transaction = {
                transaction_identifier: {
                    hash: trx.id!,
                },
                operations: [
                    {
                        operation_identifier: {
                            index: 0,
                        },
                        type: type!,
                        status: "SUCCESS",
                    },
                ],
            };
            if (address) {
                transaction.operations[0].account = {
                    address: address,
                };
            }
            if (amount) {
                transaction.operations[0].amount = {
                    value: amount,
                    currency: {
                        symbol: "ARK",
                        decimals: 8,
                    },
                };
            }
            blockTransactions.push(transaction);
        }

        let previousBlockHeight: number;
        let previousBlockHash: string;
        if (blockHeight === 1) {
            previousBlockHeight = 1;
            previousBlockHash = blockHash;
        } else {
            const previousBlock = await this.blockHistoryService.findOneByCriteria({ id: block?.data.previousBlock });
            previousBlockHeight = previousBlock!.height;
            previousBlockHash = previousBlock!.id!;
        }

        return {
            block: {
                block_identifier: {
                    index: blockHeight,
                    hash: blockHash,
                },
                timestamp: AppUtils.formatTimestamp(block!.data.timestamp).unix * 1000,
                parent_block_identifier: {
                    index: previousBlockHeight,
                    hash: previousBlockHash,
                },
                transaction: blockTransactions,
            },
        };
    }

    public async transaction(request: Hapi.Request): Promise<any> {
        return null;
    }
}
