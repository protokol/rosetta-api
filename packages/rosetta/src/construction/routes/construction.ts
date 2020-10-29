import Hapi from "@hapi/hapi";

import { ConstructionController } from "../controllers/construction";

export const register = (server: Hapi.Server): void => {
	const controller = server.app.app.resolve(ConstructionController);
	server.bind(controller);

	server.route({
		method: "POST",
		path: "/construction/derive",
		handler: (request: Hapi.Request) => controller.derive(request),
		options: {
			// validate: {
			//     payload: {},
			// },
		},
	});
};
