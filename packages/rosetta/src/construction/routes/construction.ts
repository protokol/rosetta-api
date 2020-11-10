import Hapi from "@hapi/hapi";
import Joi from "@hapi/joi";

import { metadata, network_identifier, operations, options, public_key, public_keys, signatures } from "../../schemas";
import { ConstructionController } from "../controllers/construction";

export const register = (server: Hapi.Server): void => {
	const controller = server.app.app.resolve(ConstructionController);
	server.bind(controller);

	server.route({
		method: "POST",
		path: "/construction/derive",
		handler: (request: Hapi.Request) => controller.derive(request),
		options: {
			validate: {
				payload: Joi.object({ metadata, network_identifier, public_key }),
			},
		},
	});

	server.route({
		method: "POST",
		path: "/construction/preprocess",
		handler: (request: Hapi.Request) => controller.preprocess(request),
		options: {
			validate: {
				payload: Joi.object({ metadata, network_identifier, operations }),
			},
		},
	});

	server.route({
		method: "POST",
		path: "/construction/metadata",
		handler: (request: Hapi.Request) => controller.metadata(request),
		options: {
			validate: {
				payload: Joi.object({ network_identifier, options, public_keys }),
			},
		},
	});

	server.route({
		method: "POST",
		path: "/construction/payloads",
		handler: (request: Hapi.Request) => controller.payloads(request),
		options: {
			validate: {
				payload: Joi.object({ network_identifier, operations, metadata, public_keys }),
			},
		},
	});

	server.route({
		method: "POST",
		path: "/construction/parse",
		handler: (request: Hapi.Request) => controller.parse(request),
		options: {
			validate: {
				payload: Joi.object({
					network_identifier,
					signed: Joi.boolean().required(),
					transaction: Joi.string().required(),
				}),
			},
		},
	});

	server.route({
		method: "POST",
		path: "/construction/combine",
		handler: (request: Hapi.Request) => controller.combine(request),
		options: {
			validate: {
				payload: Joi.object({
					network_identifier,
					unsigned_transaction: Joi.string().required(),
					signatures,
				}),
			},
		},
	});

	server.route({
		method: "POST",
		path: "/construction/hash",
		handler: (request: Hapi.Request) => controller.hash(request),
		options: {
			validate: {
				payload: Joi.object({
					network_identifier,
					signed_transaction: Joi.string().required(),
				}),
			},
		},
	});

	server.route({
		method: "POST",
		path: "/construction/submit",
		handler: (request: Hapi.Request) => controller.submit(request),
		options: {
			validate: {
				payload: Joi.object({
					network_identifier,
					signed_transaction: Joi.string().required(),
				}),
			},
		},
	});
};
