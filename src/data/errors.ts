import { ErrorType } from "./resources/network";

export const Errors: Record<string, ErrorType> = {
    IDENTIFIER_NOT_SUPPORTED: {
        code: 400,
        message: "network identifier is not supported",
        retriable: false,
    },
    BLOCK_NOT_FOUND: {
        code: 401,
        message: "block not found",
        retriable: false,
    },
    TX_NOT_FOUND: {
        code: 402,
        message: "transaction not found",
        retriable: false,
    },
    WALLET_NOT_FOUND: {
        code: 403,
        message: "wallet not found",
        retriable: false,
    },
};
