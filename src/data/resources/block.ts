import { BlockIdentifier, Currency, OperationType } from "./shared";

export interface BlockResource {
    block: {
        block_identifier: BlockIdentifier;
        parent_block_identifier: BlockIdentifier;
        timestamp: number;
        transactions: Transaction[];
    };
}

export interface Operation {
    operation_identifier: {
        index: number;
    };
    related_operations?: {
        index: number;
    }[];
    type: OperationType;
    status: string;
    account?: {
        address: string;
    };
    amount?: {
        value: string;
        currency: Currency;
    };
}

export interface Transaction {
    transaction_identifier: {
        hash: string;
    };
    operations: Operation[];
}

export interface TransactionResource {
    transaction: Transaction;
}
