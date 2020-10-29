import { BlockIdentifier, Transaction } from "../../interfaces";

export interface BlockResource {
	block: {
		block_identifier: BlockIdentifier;
		parent_block_identifier: BlockIdentifier;
		timestamp: number;
		transactions: Transaction[];
	};
}
