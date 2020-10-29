import { Controller } from "@arkecosystem/core-api";
import { Container, Contracts, Utils as AppUtils } from "@arkecosystem/core-kernel";
import { Managers } from "@arkecosystem/crypto";

import { blockchainName, rosettaImplementationVersion } from "../../constants";
import { Errors } from "../../errors";
import { OperationType, OpStatus } from "../../interfaces";
import { NetworkIdentifiersResource, NetworkOptionsResource, NetworkStatusResources, Peer } from "../resources/network";

const pluginVersion = require("../../../package.json").version;

export class NetworkController extends Controller {
	@Container.inject(Container.Identifiers.StateStore)
	private readonly stateStore!: Contracts.State.StateStore;

	@Container.inject(Container.Identifiers.PeerStorage)
	private readonly peerStorage!: Contracts.P2P.PeerStorage;

	public async list(): Promise<NetworkIdentifiersResource> {
		return {
			network_identifiers: [{ blockchain: blockchainName, network: Managers.configManager.get("network").name }],
		};
	}

	public async options(): Promise<NetworkOptionsResource> {
		return {
			version: {
				rosetta_version: rosettaImplementationVersion,
				node_version: this.app.version(),
				middleware_version: pluginVersion,
			},
			allow: {
				operation_statuses: [
					{
						status: OpStatus.SUCCESS,
						successful: true,
					},
					{
						status: OpStatus.FAILED,
						successful: false,
					},
				],
				operation_types: Object.values(OperationType),
				errors: Object.values(Errors),
				historical_balance_lookup: false,
			},
		};
	}

	public async status(): Promise<NetworkStatusResources> {
		const genesisBlock = this.stateStore.getGenesisBlock();
		const currentBlock = this.stateStore.getLastBlock();

		const peers: Peer[] = [];
		for (const peer of this.peerStorage.getPeers()) {
			peers.push({ peer_id: peer.ip });
			// TODO: maybe add metadata of peer
		}
		return {
			genesis_block_identifier: {
				index: genesisBlock.data.height,
				hash: genesisBlock.data.id!,
			},
			current_block_identifier: {
				index: currentBlock.data.height,
				hash: currentBlock.data.id!,
			},
			current_block_timestamp: AppUtils.formatTimestamp(currentBlock.data.timestamp).unix * 1000, // posix timestamp - milliseconds
			peers: peers,
		};
	}
}
