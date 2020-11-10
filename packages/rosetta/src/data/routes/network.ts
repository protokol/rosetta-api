import Hapi from "@hapi/hapi";
import Joi from "@hapi/joi";

import { metadata, network_identifier } from "../../schemas";
import { NetworkController } from "../controllers/network";

export const register = (server: Hapi.Server): void => {
	const controller = server.app.app.resolve(NetworkController);
	server.bind(controller);

	server.route({
		method: "POST",
		path: "/network/list",
		handler: controller.list,
		options: {
			validate: {
				payload: Joi.object({ metadata }),
			},
		},
	});

	server.route({
		method: "POST",
		path: "/network/options",
		handler: controller.options,
		options: {
			validate: {
				payload: Joi.object({ metadata, network_identifier }),
			},
		},
	});

	server.route({
		method: "POST",
		path: "/network/status",
		handler: controller.status,
		options: {
			validate: {
				payload: Joi.object({ metadata, network_identifier }),
			},
		},
	});
};
