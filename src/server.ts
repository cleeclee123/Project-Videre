import express, { Request, Response } from "express";

const app = express();
const port = 8080;

app.get("/", async (request: Request, response: Response) => {
  console.log("Hello world");
  response.send("Hello world");
});

// route error handling: route doesn't exist
app.use((request: Request, response: Response, next) => {
  response.status(404).send("404 Error, Endpoint Doesn't Exist");
});

app.listen(port, (): void => {
  console.log(`App is listening at ${port}`);
});
