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
	senderPublicKey: string;
}

export interface PreprocessResource {
	options: Options;
	required_public_keys: Account[];
}

export interface Metadata {
	nonce: string;
	fee?: string;
}

export interface MetadataResource {
	metadata: Metadata;
}

export interface SigningPayload {
	account_identifier: Account;
	hex_bytes: string;
	signature_type: string;
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
