import { ErrorType } from "./interfaces";

export const Errors: Record<string, ErrorType> = {
	UNSUPPORTED_IDENTIFIER: {
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
	UNSUPPORTED_CURVE_TYPE: {
		code: 404,
		message: "curve type is not supported",
		retriable: false,
	},
	INVALID_PUBKEY: {
		code: 405,
		message: "invalid pubkey hex bytes",
		retriable: false,
	},
	INVALID_OPERATIONS: {
		code: 406,
		message: "invalid number of operations",
		retriable: false,
	},
};
