import { Account, Operation, OperationType, TransactionIdentifier } from "../../interfaces";

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
	fee?: string;
	senderPublicKey: string;
}

export interface MetadataResource {
	metadata: Metadata;
}

export interface SigningPayload {
	account_identifier: Account;
	hex_bytes: string;
	signature_type?: string;
}

export interface PayloadsResource {
	unsigned_transaction: string;
	payloads: SigningPayload[];
}

export interface ParseResource {
	operations: Operation[];
	account_identifier_signers: Account[];
}

export interface Signature {
	hex_bytes: string;
	signature_type: string;
	public_key: string;
	signing_payload: SigningPayload;
}

export interface CombineResource {
	signed_transaction: string;
}

export interface HashResource {
	transaction_identifier: TransactionIdentifier;
}
