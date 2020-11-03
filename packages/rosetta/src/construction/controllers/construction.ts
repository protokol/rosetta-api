import { Connection } from "@arkecosystem/client";
import { Controller } from "@arkecosystem/core-api";
import { Container } from "@arkecosystem/core-kernel";
import { Identities, Transactions, Utils } from "@arkecosystem/crypto";
import Hapi from "@hapi/hapi";

import { Errors } from "../../errors";
import { Account, ErrorType, Operation, OperationType } from "../../interfaces";
import { constructOperations } from "../../utils";
import {
	DeriveResource,
	Metadata,
	MetadataResource,
	Options,
	ParseResource,
	PayloadsResource,
	PreprocessResource,
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

		return { options };
	}

	public async metadata(request: Hapi.Request): Promise<MetadataResource | ErrorType> {
		const { options }: PreprocessResource = request.payload;

		const {
			body: { data: wallet },
		} = await this.getClient().api("wallets").get(options.sender);

		const metadata = {
			nonce: Utils.BigNumber.make(wallet.nonce).plus(1).toFixed(),
			fee: options.fee,
			senderPublicKey: wallet.publicKey,
		};

		return { metadata };
	}

	public async payloads(request: Hapi.Request): Promise<PayloadsResource | ErrorType> {
		const { operations, metadata }: { operations: Operation[]; metadata: Metadata } = request.payload;

		const sender = operations[0].account!.address;
		const reciever = operations[1].account!.address;
		const value = operations[1].amount!.value;

		let transaction = Transactions.BuilderFactory.transfer()
			.nonce(metadata.nonce)
			.recipientId(reciever)
			.amount(value)
			.senderPublicKey(metadata.senderPublicKey);
		if (metadata.fee) {
			transaction = transaction.fee(metadata.fee);
		}

		const unsignedTx = Transactions.Utils.toBytes(transaction.data).toString("hex");
		const hashTx = Transactions.Utils.toHash(transaction.data, { excludeSignature: true }).toString("hex");

		return {
			unsigned_transaction: unsignedTx,
			payloads: [{ account_identifier: { address: sender }, hex_bytes: hashTx }],
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

	private getClient(): Connection {
		if (!this.client) {
			this.client = new Connection("http://localhost:4003/api"); // TODO get url from config
		}

		return this.client;
	}
}
