// /network/list resources

import { BlockIdentifier, NetworkIdentifier } from "./shared";

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
        operation_types: string[];
        errors: ErrorType[];
        historical_balance_lookup: boolean;
    };
}

export interface OperationStatus {
    status: string;
    successful: boolean;
}

export interface ErrorType {
    code: number;
    message: string;
    retriable: boolean;
    details?: any;
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
