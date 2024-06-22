import express from "express";
import fs from "fs";

const app = express();
const port = 3000;

app.get("/:slug", async (req, res) => {
  if (!fs.existsSync(req.params.slug)) {
    return res.json({error: "Path not found"}).status(404);
  }

  if (!req.query.method) {
    return res.json({error: "Missing a query method"}).status(422);
  }

  if (req.query.method === "readFile") {
    const readFile = (await import("./operations/readFile")).default;

    try {
      const file = readFile({path: req.params.slug});
      return res.json({buffer: file});
    } catch (err) {
      return res.json({error: err}).status(500);
    }
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
