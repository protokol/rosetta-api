import Hapi from "@hapi/hapi";

import { BlockController } from "../controllers/block";

export const register = (server: Hapi.Server): void => {
    const controller = server.app.app.resolve(BlockController);
    server.bind(controller);

    server.route({
        method: "POST",
        path: "/block",
        handler: (request: Hapi.Request) => controller.block(request),
        options: {
            // validate: {
            //     payload: {},
            // },
        },
    });

    server.route({
        method: "POST",
        path: "/block/transaction",
        handler: (request: Hapi.Request) => controller.transaction(request),
        options: {},
    });
};
