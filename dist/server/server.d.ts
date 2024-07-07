/**
 * The class for controllering the file relay server.
 */
declare class Server {
    private app;
    private port;
    private server;
    constructor();
    /**
     * Initilizes the file relay server
     * @returns The url to the open Ngrok tunnel
     * @async
     */
    init(): Promise<string | null>;
    /**
     * Stops the server by closing the current connection.
     * */
    stop(): void;
}
export default Server;
