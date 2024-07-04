import {describe, it, expect} from "vitest";
import mkdir from "../mkdir";
import fs from "fs";

describe("#mkdir", () => {
  it("should create a directory", async () => {
    await mkdir(".test");

    if (!fs.existsSync(".test")) {
      throw new Error("TEST FAILED: Could not create a directory");
    }
  });
});
