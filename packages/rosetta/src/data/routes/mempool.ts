import Hapi from "@hapi/hapi";

import { MempoolController } from "../controllers/mempool";

export const register = (server: Hapi.Server): void => {
	const controller = server.app.app.resolve(MempoolController);
	server.bind(controller);

	server.route({
		method: "POST",
		path: "/mempool",
		handler: (request: Hapi.Request) => controller.list(request),
		options: {},
	});

	server.route({
		method: "POST",
		path: "/mempool/transaction",
		handler: (request: Hapi.Request) => controller.transaction(request),
		options: {},
	});
};
