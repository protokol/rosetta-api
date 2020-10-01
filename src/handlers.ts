import Hapi from "@hapi/hapi";

import * as Network from "./data/routes/network";

export = {
    async register(server: Hapi.Server): Promise<void> {
        Network.register(server);
    },
    name: "Rosetta Api",
    version: "1.0.0",
};
