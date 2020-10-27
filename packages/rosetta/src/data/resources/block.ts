import { BlockIdentifier, Currency, OperationType, Transaction } from "./shared";

export interface BlockResource {
	block: {
		block_identifier: BlockIdentifier;
		parent_block_identifier: BlockIdentifier;
		timestamp: number;
		transactions: Transaction[];
	};
}
