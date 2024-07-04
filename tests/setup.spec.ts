import {describe, it} from "vitest";
import {init, initServer} from "../src";
import dotenv from "dotenv";

dotenv.config();

describe("#setup", () => {
  it("should initialize the server", async () => {
    await init((await initServer()) as string);
  });
});
