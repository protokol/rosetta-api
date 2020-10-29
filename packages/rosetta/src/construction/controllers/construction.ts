import { Controller } from "@arkecosystem/core-api";
import { Container } from "@arkecosystem/core-kernel";

import { ErrorType } from "../../interfaces";

@Container.injectable()
export class ConstructionController extends Controller {
	public async derive(): Promise<string | ErrorType> {
		return "derive";
	}
}
