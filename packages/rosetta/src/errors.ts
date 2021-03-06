import { ErrorType } from "./interfaces";

type ErrorEnums =
	| "UNSUPPORTED_IDENTIFIER"
	| "BLOCK_NOT_FOUND"
	| "TX_NOT_FOUND"
	| "WALLET_NOT_FOUND"
	| "UNSUPPORTED_CURVE_TYPE"
	| "INVALID_PUBKEY"
	| "INVALID_OPERATIONS"
	| "INVALID_TRANSACTION"
	| "MISSING_PUBKEY";

export const Errors: Record<ErrorEnums, ErrorType> = {
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
	INVALID_TRANSACTION: {
		code: 407,
		message: "invalid transaction",
		retriable: false,
	},
	MISSING_PUBKEY: {
		code: 408,
		message: "missing public key that is required to build a transaction",
		retriable: false,
	},
};
