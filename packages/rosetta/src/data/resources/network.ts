import { BlockIdentifier, ErrorType, OperationType, OpStatus } from "../../interfaces";

// /network/list resources

export interface NetworkIdentifier {
	blockchain: string;
	network: string;
}

export interface NetworkIdentifiersResource {
	network_identifiers: NetworkIdentifier[];
}

// /network/options resources

export interface NetworkOptionsResource {
	version: {
		rosetta_version: string;
		node_version: string;
		middleware_version: string;
	};
	allow: {
		operation_statuses: OperationStatus[];
		operation_types: OperationType[];
		errors: ErrorType[];
		historical_balance_lookup: boolean;
	};
}

export interface OperationStatus {
	status: OpStatus;
	successful: boolean;
}

// /network/status resources

export interface NetworkStatusResources {
	current_block_identifier: BlockIdentifier;
	current_block_timestamp: number;
	genesis_block_identifier: BlockIdentifier;
	peers: Peer[];
}

export interface Peer {
	peer_id: string;
	metadata?: any;
}
