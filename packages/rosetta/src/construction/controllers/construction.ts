import { Connection } from "@arkecosystem/client";
import { Controller } from "@arkecosystem/core-api";
import { Container } from "@arkecosystem/core-kernel";
import { Identities, Transactions, Utils } from "@arkecosystem/crypto";
import Hapi from "@hapi/hapi";

import { Errors } from "../../errors";
import { Account, ErrorType, Operation, OperationType } from "../../interfaces";
import { constructOperations } from "../../utils";
import {
	CombineResource,
	DeriveResource,
	HashResource,
	Metadata,
	MetadataResource,
	Options,
	ParseResource,
	PayloadsResource,
	PreprocessResource,
	Signature,
} from "../resources/construction";

@Container.injectable()
export class ConstructionController extends Controller {
	private client: Connection | undefined;

	public async derive(request: Hapi.Request): Promise<DeriveResource | ErrorType> {
		const {
			public_key: { hex_bytes, curve_type },
		} = request.payload;

		if (curve_type !== "secp256k1") {
			return Errors.UNSUPPORTED_CURVE_TYPE;
		}

		if (!Identities.PublicKey.verify(hex_bytes)) {
			return Errors.INVALID_PUBKEY;
		}

		const address = Identities.Address.fromPublicKey(hex_bytes);
		return { account_identifier: { address } };
	}

	public async preprocess(request: Hapi.Request): Promise<PreprocessResource | ErrorType> {
		const { operations, metadata }: { operations: Operation[]; metadata: any } = request.payload;

		if (operations.length !== 2) {
			return Errors.INVALID_OPERATIONS;
		}

		const options = {} as Options;
		if (metadata?.fee) {
			options.fee = metadata.fee;
		}

		options.sender = operations[0].account!.address;
		options.reciever = operations[1].account!.address;
		options.type = operations[0].type;
		options.value = operations[1].amount!.value;

		return { options, required_public_keys: [{ address: options.sender }] };
	}

	public async metadata(request: Hapi.Request): Promise<MetadataResource | ErrorType> {
		const { options }: PreprocessResource = request.payload;

		const {
			body: { data: wallet },
		} = await this.getClient().api("wallets").get(options.sender);

		const metadata = {
			nonce: Utils.BigNumber.make(wallet.nonce).plus(1).toFixed(),
			fee: options.fee,
		};

		return { metadata };
	}

	public async payloads(request: Hapi.Request): Promise<PayloadsResource | ErrorType> {
		const {
			operations,
			metadata,
			public_keys: publicKeys,
		}: { operations: Operation[]; metadata: Metadata; public_keys: any } = request.payload;

		const sender = operations[0].account!.address;
		const reciever = operations[1].account!.address;
		const value = operations[1].amount!.value;

		let transaction = Transactions.BuilderFactory.transfer()
			.nonce(metadata.nonce)
			.recipientId(reciever)
			.amount(value)
			.senderPublicKey(publicKeys[0].hex_bytes);
		if (metadata.fee) {
			transaction = transaction.fee(metadata.fee);
		}

		const unsignedTx = Transactions.Utils.toBytes(transaction.data).toString("hex");
		const hashTx = Transactions.Utils.toHash(transaction.data, { excludeSignature: true }).toString("hex");

		return {
			unsigned_transaction: unsignedTx,
			payloads: [{ account_identifier: { address: sender }, hex_bytes: hashTx, signature_type: "ecdsa" }],
		};
	}

	public async parse(request: Hapi.Request): Promise<ParseResource | ErrorType> {
		const { transaction: hexTx, signed }: { transaction: string; signed: boolean } = request.payload;

		const transaction = Transactions.TransactionFactory.fromBytesUnsafe(Buffer.from(hexTx, "hex"));
		const {
			data: { senderPublicKey, amount, recipientId },
		} = transaction;
		const sender = Identities.Address.fromPublicKey(senderPublicKey!);

		const operations = constructOperations(
			{ value: 0 },
			OperationType.TRANSFER,
			amount.toFixed(),
			sender,
			recipientId,
			false,
		);
		const signers: Account[] = [];
		if (signed) {
			signers.push({ address: sender });
		}

		return {
			operations,
			account_identifier_signers: signers,
		};
	}

	public async combine(request: Hapi.Request): Promise<CombineResource | ErrorType> {
		const {
			unsigned_transaction: unsignedTx,
			signatures,
		}: { unsigned_transaction: string; signatures: Signature[] } = request.payload;

		const transaction = Transactions.TransactionFactory.fromBytesUnsafe(Buffer.from(unsignedTx, "hex"));
		transaction.data.signature = signatures[0].hex_bytes;
		const signedTx = Transactions.Utils.toBytes(transaction.data).toString("hex");

		return { signed_transaction: signedTx };
	}

	public async hash(request: Hapi.Request): Promise<HashResource | ErrorType> {
		const { signed_transaction: signedTx }: { signed_transaction: string } = request.payload;

		const transaction = Transactions.TransactionFactory.fromHex(signedTx);

		return { transaction_identifier: { hash: transaction.id! } };
	}

	public async submit(request: Hapi.Request): Promise<HashResource | ErrorType> {
		const { signed_transaction: signedTx }: { signed_transaction: string } = request.payload;

		const transaction = Transactions.TransactionFactory.fromHex(signedTx);
		const {
			body: { data },
		} = await this.getClient()
			.api("transactions")
			.create({ transactions: [transaction.toJson()] });

		if (data.invalid.length > 0) {
			return Errors.INVALID_TRANSACTION;
		}

		return { transaction_identifier: { hash: data.broadcast[0] || data.accept[0] } };
	}

	private getClient(): Connection {
		if (!this.client) {
			this.client = new Connection("http://localhost:4003/api"); // TODO get url from config
		}

		return this.client;
	}
}
