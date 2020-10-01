// /network/list resources

export interface NetworkIdentifiersResource {
    network_identifiers: NetworkIdentifier[];
}

export interface NetworkIdentifier {
    blockchain: string;
    network: string;
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
        errors: Error[];
    };
}

export interface OperationStatus {
    status: string;
    successful: boolean;
}

export interface Error {
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

export interface BlockIdentifier {
    index: number;
    hash: string;
}

export interface Peer {
    peer_id: string;
    metadata?: any;
}
