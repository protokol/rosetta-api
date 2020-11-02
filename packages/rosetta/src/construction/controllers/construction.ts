import { Controller } from "@arkecosystem/core-api";
import { Container } from "@arkecosystem/core-kernel";
import { Identities } from "@arkecosystem/crypto";
import Hapi from "@hapi/hapi";

import { Errors } from "../../errors";
import { ErrorType, Operation } from "../../interfaces";
import { DeriveResource, Options, PreprocessResource } from "../resources/construction";

@Container.injectable()
export class ConstructionController extends Controller {
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
}
