export interface ErrorType {
	code: number;
	message: string;
	retriable: boolean;
	details?: any;
}

export interface BlockIdentifier {
	index: number;
	hash: string;
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

export interface TransactionIdentifier {
	hash: string;
}

export interface Transaction {
	transaction_identifier: TransactionIdentifier;
	operations: Operation[];
}

export interface TransactionResource {
	transaction: Transaction;
}

export interface Currency {
	symbol: string;
	decimals: number;
	metadata: any;
}

export enum OperationType {
	"TRANSFER" = "Transfer",
	"FEE" = "Fee",
	"MULTI_PAYMENT" = "Multi Payment",
	"BLOCK_REWARD" = "Block Reward",
}

export enum OpStatus {
	"SUCCESS" = "SUCCESS",
	"FAILED" = "FAILED",
}
