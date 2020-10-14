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
