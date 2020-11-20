import { Controller } from "@arkecosystem/core-api";
import { Container, Contracts } from "@arkecosystem/core-kernel";
import Hapi from "@hapi/hapi";

import { currency } from "../../constants";
import { Errors } from "../../errors";
import { ErrorType } from "../../interfaces";
import { AccountResource } from "../resources/account";

@Container.injectable()
export class AccountController extends Controller {
	@Container.inject(Container.Identifiers.StateStore)
	private readonly stateStore!: Contracts.State.StateStore;

	@Container.inject(Container.Identifiers.WalletRepository)
	@Container.tagged("state", "blockchain")
	private readonly walletRepository!: Contracts.State.WalletRepository;

	public async balance(request: Hapi.Request): Promise<AccountResource | ErrorType> {
		const lastBlock = this.stateStore.getLastBlock();
		const walletResource = this.walletRepository.findByAddress(request.payload.account_identifier.address);

		if (!walletResource) {
			return Errors.WALLET_NOT_FOUND;
		}

		let value = walletResource.balance.toFixed();
		// genesis wallet has negative balance -> instead return 0
		if (this.stateStore.getGenesisBlock().transactions[0]?.data.senderPublicKey == walletResource.publicKey) {
			value = "0";
		}
		return {
			block_identifier: {
				index: lastBlock.data.height,
				hash: lastBlock.data.id!,
			},
			balances: [
				{
					value,
					currency,
					metadata: {},
				},
			],
		};
	}
}
