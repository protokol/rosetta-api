import { Controller } from "@arkecosystem/core-api";
import { Container, Contracts } from "@arkecosystem/core-kernel";
import Hapi from "@hapi/hapi";

import { TransactionIdentifiers } from "../resources/mempool";
import { ErrorType } from "../resources/network";
import { TransactionIdentifier } from "../resources/shared";

@Container.injectable()
export class MempoolController extends Controller {
	@Container.inject(Container.Identifiers.TransactionPoolQuery)
	private readonly poolQuery!: Contracts.TransactionPool.Query;

	public async list(request: Hapi.Request): Promise<TransactionIdentifiers | ErrorType> {
		console.log("list");
		const txs: TransactionIdentifier[] = [];
		for (const tx of this.poolQuery.getAll()) {
			txs.push({ hash: tx.id! });
		}

		return { transaction_identifiers: txs };
	}
}
