import type { Express } from "express";
import http from "http";
/**
 * The class for controllering the file relay server.
 */
declare class Server {
    private app;
    private port;
    private server;
    /**
     * An optional custom function to use your own Express server.
     * @param app - The express app
     * @param server - The http server
     * @returns The url of your custom server
     */
    private startServer?;
    /**
     * The constructor of the class for controllering the file relay server.
     * @param startServer - An optional custom function to use your own Express server
     */
    constructor(startServer?: (app: Express, server?: http.Server) => Promise<string> | string);
    /**
     * Initilizes the file relay server
     * @returns The url to the open Ngrok tunnel
     * @async
     */
    init(): Promise<string | null>;
    /**
     * Stops the server by closing the current connection.
     */
    stop(): void;
}
export default Server;
