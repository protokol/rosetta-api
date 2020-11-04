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

	server.route({
		method: "POST",
		path: "/construction/preprocess",
		handler: (request: Hapi.Request) => controller.preprocess(request),
		options: {
			// validate: {
			//     payload: {},
			// },
		},
	});

	server.route({
		method: "POST",
		path: "/construction/metadata",
		handler: (request: Hapi.Request) => controller.metadata(request),
		options: {
			// validate: {
			//     payload: {},
			// },
		},
	});

	server.route({
		method: "POST",
		path: "/construction/payloads",
		handler: (request: Hapi.Request) => controller.payloads(request),
		options: {
			// validate: {
			//     payload: {},
			// },
		},
	});

	server.route({
		method: "POST",
		path: "/construction/parse",
		handler: (request: Hapi.Request) => controller.parse(request),
		options: {
			// validate: {
			//     payload: {},
			// },
		},
	});

	server.route({
		method: "POST",
		path: "/construction/combine",
		handler: (request: Hapi.Request) => controller.combine(request),
		options: {
			// validate: {
			//     payload: {},
			// },
		},
	});
};
