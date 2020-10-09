import { BlockIdentifier } from "./shared";

export interface BlockResource {
    block: {
        block_identifier: BlockIdentifier;
        parent_block_identifier: BlockIdentifier;
        timestamp: number;
        transactions: Transaction[];
    };
}

export interface Transaction {
    transaction_identifier: {
        hash: string;
    };
    operations: [
        {
            operation_identifier: {
                index: number;
            };
            type: string;
            status: string;
            account?: {
                address: string;
            };
            amount?: {
                value: string;
                currency: {
                    symbol: string;
                    decimals: number;
                };
            };
        },
    ];
}

export interface TransactionResource {
    transaction: Transaction;
}
