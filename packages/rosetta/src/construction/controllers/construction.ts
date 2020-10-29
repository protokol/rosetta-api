import { Controller } from "@arkecosystem/core-api";
import { Container } from "@arkecosystem/core-kernel";
import { Identities } from "@arkecosystem/crypto";
import Hapi from "@hapi/hapi";

import { Errors } from "../../errors";
import { ErrorType } from "../../interfaces";
import { DeriveResource } from "../resources/construction";

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
}
