import {it, expect, describe} from "vitest";
import {Server, init} from "../..";

describe("server", () => {
  it("should initialize the server returning a valid url", async () => {
    const server = new Server();
    const url = await server.init();

    expect(url).toMatch(
      new RegExp(
        /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
      )
    );

    const response = await fetch(` ${url}/fs`);

    const data = await response.json();
    expect(data).toBeTypeOf("object");

    server.stop();
  });

  it("should stop the server and close the url when server.stop is called", async () => {
    const server = new Server();
    const url = await server.init();
    server.stop();

    const response = await fetch(` ${url}/fs`);
    expect(response.ok).toBe(false);
  });

  it("should successfully initialize universal-fs on the server", async () => {
    const server = new Server();
    const url = await server.init();
    expect(url).not.toBeNull();

    await init(url as string);

    server.stop();
  });

  it("should throw an error when an invalid .env path is provided", () => {
    const server = new Server({envPath: "./.env"});
    expect(server.init).rejects.toThrow();
  });
});
