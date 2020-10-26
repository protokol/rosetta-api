export interface NetworkIdentifier {
	blockchain: string;
	network: string;
}

export interface BlockIdentifier {
	index: number;
	hash: string;
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
}

export enum OpStatus {
	"SUCCESS" = "SUCCESS",
	"FAILED" = "FAILED",
}
