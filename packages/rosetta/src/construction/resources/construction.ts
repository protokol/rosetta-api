import { Account, OperationType } from "../../interfaces";

export interface DeriveResource {
	account_identifier: Account;
}

export interface Options {
	fee?: string;
	sender: string;
	reciever: string;
	value: string;
	type: OperationType;
}

export interface PreprocessResource {
	options: Options;
}

export interface Metadata {
	nonce: string;
}

export interface MetadataResource {
	metadata: Metadata;
}
