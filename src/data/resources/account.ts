import { BlockIdentifier } from "./shared";

export interface AccountResource {
    block_identifier: BlockIdentifier;
    balances: Balance[];
}

export interface Balance {
    value: string;
    currency: {
        symbol: string;
        decimals: number;
        metadata: any;
    };
    metadata: any;
}
