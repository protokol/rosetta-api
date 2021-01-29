import Hapi from "@hapi/hapi";
import Joi from "joi";

import { block_identifier, block_identifier_required, network_identifier, transaction_identifier } from "../../schemas";
import { BlockController } from "../controllers/block";

export const register = (server: Hapi.Server): void => {
	const controller = server.app.app.resolve(BlockController);
	server.bind(controller);

	server.route({
		method: "POST",
		path: "/block",
		handler: (request: Hapi.Request) => controller.block(request),
		options: {
			validate: {
				payload: Joi.object({ block_identifier, network_identifier }),
			},
		},
	});

	server.route({
		method: "POST",
		path: "/block/transaction",
		handler: (request: Hapi.Request) => controller.transaction(request),
		options: {
			validate: {
				payload: Joi.object({
					block_identifier: block_identifier_required,
					network_identifier,
					transaction_identifier,
				}),
			},
		},
	});
};
