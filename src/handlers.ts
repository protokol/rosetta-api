import Hapi from "@hapi/hapi";

import * as Block from "./data/routes/block";
import * as Network from "./data/routes/network";

export = {
    async register(server: Hapi.Server): Promise<void> {
        Network.register(server);
        Block.register(server);
    },
    name: "Rosetta Api",
    version: "1.0.0",
};
