import Hapi from "@hapi/hapi";
import Joi from "joi";

import { metadata, network_identifier, transaction_identifier } from "../../schemas";
import { MempoolController } from "../controllers/mempool";

export const register = (server: Hapi.Server): void => {
	const controller = server.app.app.resolve(MempoolController);
	server.bind(controller);

	server.route({
		method: "POST",
		path: "/mempool",
		handler: (request: Hapi.Request) => controller.list(request),
		options: {
			validate: {
				payload: Joi.object({ metadata, network_identifier }),
			},
		},
	});

	server.route({
		method: "POST",
		path: "/mempool/transaction",
		handler: (request: Hapi.Request) => controller.transaction(request),
		options: {
			validate: {
				payload: Joi.object({ transaction_identifier, network_identifier }),
			},
		},
	});
};
