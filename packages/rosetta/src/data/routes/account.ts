import Hapi from "@hapi/hapi";
import Joi from "@hapi/joi";

import { account_identifier, network_identifier } from "../../schemas";
import { AccountController } from "../controllers/account";

export const register = (server: Hapi.Server): void => {
	const controller = server.app.app.resolve(AccountController);
	server.bind(controller);

	server.route({
		method: "POST",
		path: "/account/balance",
		handler: (request: Hapi.Request) => controller.balance(request),
		options: {
			validate: {
				payload: Joi.object({ network_identifier, account_identifier }),
			},
		},
	});
};
