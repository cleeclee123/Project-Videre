import express, { Request, Response } from "express";

const app = express();
const port = 8080;

app.get("/", async (request: Request, response: Response) => {
  console.log("Hello world");
  response.send("Hello world");
});

app.listen(port, (): void => {
  console.log(`App is listening at ${port}`);
});
