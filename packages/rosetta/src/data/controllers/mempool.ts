import { Controller } from "@arkecosystem/core-api";
import { Container, Contracts } from "@arkecosystem/core-kernel";
import Hapi from "@hapi/hapi";

import { Errors } from "../../errors";
import { ErrorType, TransactionIdentifier, TransactionResource } from "../../interfaces";
import { buildTransactionInfo } from "../../utils";
import { TransactionIdentifiers } from "../resources/mempool";

@Container.injectable()
export class MempoolController extends Controller {
	@Container.inject(Container.Identifiers.TransactionPoolQuery)
	private readonly poolQuery!: Contracts.TransactionPool.Query;

	public async list(): Promise<TransactionIdentifiers | ErrorType> {
		const txs: TransactionIdentifier[] = [];
		for (const tx of this.poolQuery.getAll()) {
			txs.push({ hash: tx.id! });
		}

		return { transaction_identifiers: txs };
	}

	public async transaction(request: Hapi.Request): Promise<TransactionResource | ErrorType> {
		try {
			const transaction = this.poolQuery.getAll().whereId(request.payload.transaction_identifier.hash).first();
			return {
				transaction: buildTransactionInfo(transaction.data, undefined, false),
			};
		} catch (err) {
			return Errors.TX_NOT_FOUND;
		}
	}
}
