import Hapi from "@hapi/hapi";
import Joi from "@hapi/joi";

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
                payload: Joi.object().keys({ metadata: Joi.object().optional() }).required().unknown(false),
            },
        },
    });

    server.route({
        method: "POST",
        path: "/network/options",
        handler: controller.options,
        options: {
            // validate: {
            //     payload: {},
            // },
        },
    });

    server.route({
        method: "POST",
        path: "/network/status",
        handler: controller.status,
        options: {},
    });
};
