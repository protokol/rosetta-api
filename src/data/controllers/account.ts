import { Controller } from "@arkecosystem/core-api";
import { Container, Contracts } from "@arkecosystem/core-kernel";
import Hapi from "@hapi/hapi";

import { currency } from "../constants";
import { Errors } from "../errors";
import { AccountResource } from "../resources/account";
import { ErrorType } from "../resources/network";

@Container.injectable()
export class AccountController extends Controller {
    @Container.inject(Container.Identifiers.BlockchainService)
    private readonly blockchain!: Contracts.Blockchain.Blockchain;

    @Container.inject(Container.Identifiers.WalletRepository)
    @Container.tagged("state", "blockchain")
    private readonly walletRepository!: Contracts.State.WalletRepository;

    public async balance(request: Hapi.Request): Promise<AccountResource | ErrorType> {
        const lastBlock = this.blockchain.getLastBlock();
        const walletResource = this.walletRepository.findByAddress(request.payload.account_identifier.address);

        if (!walletResource) {
            return Errors.WALLET_NOT_FOUND;
        }

        return {
            block_identifier: {
                index: lastBlock.data.height,
                hash: lastBlock.data.id!,
            },
            balances: [
                {
                    value: walletResource.balance.toFixed(),
                    currency,
                    metadata: {},
                },
            ],
        };
    }
}
