import http from "node:http";
import app from "./app";
import config from "./utils/config";
import logger from "./utils/logger";
import { connectDb, disconnectDb } from "./db";

const server = http.createServer(app);

server.on("listening", () => {
	const addr = server.address();
	const bind = `port ${addr.port}`;
	logger.info("listening on: %s", bind);
});

process.on("SIGTERM", () => server.close(() => disconnectDb()));

connectDb().then(() => server.listen(config.port));
