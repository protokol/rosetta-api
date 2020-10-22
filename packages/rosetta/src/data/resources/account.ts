import { BlockIdentifier, Currency } from "./shared";

export interface AccountResource {
	block_identifier: BlockIdentifier;
	balances: Balance[];
}

export interface Balance {
	value: string;
	currency: Currency;
	metadata: any;
}
