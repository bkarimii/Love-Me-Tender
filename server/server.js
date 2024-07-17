import http from "node:http";
import app from "./app";
import config from "./utils/config";
import logger from "./utils/logger";

const server = http.createServer(app);

server.on("listening", () => {
	const addr = server.address();
	const bind = `port ${addr.port}`;
	logger.info("listening on: %s", bind);
});

const disconnectDb = () => {
	logger.info("Disconnecting from the database...");
};

process.on("SIGTERM", () => server.close(() => disconnectDb()));

server.listen(config.port);
