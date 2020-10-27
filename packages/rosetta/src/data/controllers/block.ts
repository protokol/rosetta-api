import { Controller } from "@arkecosystem/core-api";
import { Container, Contracts, Utils as AppUtils } from "@arkecosystem/core-kernel";
import { Identities } from "@arkecosystem/crypto";
import Hapi from "@hapi/hapi";

import { Errors } from "../errors";
import { BlockResource } from "../resources/block";
import { ErrorType } from "../resources/network";
import { OperationType, Transaction, TransactionResource } from "../resources/shared";
import { buildTransactionInfo, constructOperations } from "../utils";

@Container.injectable()
export class BlockController extends Controller {
	@Container.inject(Container.Identifiers.BlockHistoryService)
	private readonly blockHistoryService!: Contracts.Shared.BlockHistoryService;

	@Container.inject(Container.Identifiers.StateStore)
	private readonly stateStore!: Contracts.State.StateStore;

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
				{ height: this.stateStore.getLastHeight() },
				{},
			);
		}

		if (!block) {
			return Errors.BLOCK_NOT_FOUND;
		}

		const blockHeight = block.data.height;
		const blockHash = block.data.id!;
		const blockTransactions: Transaction[] = [];
		const forger = Identities.Address.fromPublicKey(block.data.generatorPublicKey);
		for (const tx of block.transactions) {
			blockTransactions.push(
				buildTransactionInfo(
					tx,
					forger,
					this.stateStore.getGenesisBlock().transactions[0].data.senderPublicKey === tx.senderPublicKey,
				),
			);
		}
		// add block reward
		if (!block.data.reward.isZero()) {
			blockTransactions.push({
				transaction_identifier: {
					hash: blockHash,
				},
				operations: constructOperations(
					{ value: 0 },
					OperationType.BLOCK_REWARD,
					block.data.reward.toFixed(),
					undefined,
					forger,
				),
			});
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

		return {
			transaction: buildTransactionInfo(
				transaction,
				Identities.Address.fromPublicKey(block!.data.generatorPublicKey),
				this.stateStore.getGenesisBlock().transactions[0].data.senderPublicKey === transaction.senderPublicKey,
			),
		};
	}
}
