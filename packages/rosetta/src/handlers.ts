import Hapi from "@hapi/hapi";

import * as Construction from "./construction/routes/construction";
import * as Account from "./data/routes/account";
import * as Block from "./data/routes/block";
import * as Mempool from "./data/routes/mempool";
import * as Network from "./data/routes/network";

export = {
	async register(server: Hapi.Server): Promise<void> {
		Network.register(server);
		Block.register(server);
		Account.register(server);
		Mempool.register(server);
		Construction.register(server);
	},
	name: "Rosetta Api",
	version: "1.0.0",
};
