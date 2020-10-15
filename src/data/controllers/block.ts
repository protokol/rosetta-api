import { Controller } from "@arkecosystem/core-api";
import { Container, Contracts, Utils as AppUtils } from "@arkecosystem/core-kernel";
import { Enums, Interfaces } from "@arkecosystem/crypto";
import Hapi from "@hapi/hapi";

import { currency } from "../constants";
import { Errors } from "../errors";
import { BlockResource, Transaction, TransactionResource } from "../resources/block";
import { ErrorType } from "../resources/network";

@Container.injectable()
export class BlockController extends Controller {
    @Container.inject(Container.Identifiers.BlockHistoryService)
    private readonly blockHistoryService!: Contracts.Shared.BlockHistoryService;

    @Container.inject(Container.Identifiers.BlockchainService)
    private readonly blockchain!: Contracts.Blockchain.Blockchain;

    public async block(request: Hapi.Request): Promise<BlockResource | ErrorType> {
        const { block_identifier } = request.payload;
        let block: Contracts.Shared.BlockDataWithTransactionData | undefined;
        if (block_identifier.index) {
            block = await this.blockHistoryService.findOneByCriteriaJoinTransactions(
                { height: block_identifier.index },
                {},
            );
        } else if (block_identifier.hash) {
            block = await this.blockHistoryService.findOneByCriteriaJoinTransactions({ id: block_identifier.hash }, {});
        } else {
            block = await this.blockHistoryService.findOneByCriteriaJoinTransactions(
                { height: this.blockchain.getLastHeight() },
                {},
            );
        }

        if (!block) {
            return Errors.BLOCK_NOT_FOUND;
        }

        const blockHeight = block.data.height;
        const blockHash = block.data.id!;
        const blockTransactions: Transaction[] = [];
        for (const trx of block.transactions) {
            blockTransactions.push(this.buildTransactionInfo(trx));
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
                timestamp: AppUtils.formatTimestamp(block.data.timestamp).unix * 1000,
                parent_block_identifier: {
                    index: previousBlockHeight,
                    hash: previousBlockHash,
                },
                transactions: blockTransactions,
            },
        };
    }

    // We probably dont need this method because all transactions are returned by method block
    public async transaction(request: Hapi.Request): Promise<TransactionResource | ErrorType> {
        const block = await this.blockHistoryService.findOneByCriteriaJoinTransactions(
            { height: request.payload.block_identifier.index },
            {
                id: request.payload.transaction_identifier.hash,
            },
        );
        const transaction = block?.transactions[0];
        if (!transaction) {
            return Errors.TX_NOT_FOUND;
        }

        return { transaction: this.buildTransactionInfo(transaction) };
    }

    private buildTransactionInfo(transaction: Interfaces.ITransactionData): Transaction {
        let type: string;
        let address: string | undefined;
        let amount: string | undefined;
        if (transaction.type === Enums.TransactionType.Transfer) {
            type = "transfer";
            address = transaction.recipientId;
            amount = transaction.amount.toFixed();
        }
        if (transaction.type === Enums.TransactionType.DelegateRegistration) {
            type = "delegateRegistration";
        }
        if (transaction.type === Enums.TransactionType.Vote) {
            type = "vote";
        }
        const transactionInfo: Transaction = {
            transaction_identifier: {
                hash: transaction.id!,
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
            transactionInfo.operations[0].account = {
                address: address,
            };
        }
        if (amount) {
            transactionInfo.operations[0].amount = {
                value: amount,
                currency,
            };
        }

        return transactionInfo;
    }
}
