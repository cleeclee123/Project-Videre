import express, { Express, Request, Response } from 'express';
import { getMyPublicIP } from "./proxy_checks.js";

const app: Express = express();
const port = 8888;

app.enable('trust proxy');

app.get('/', (req: Request, res: Response) => {
  res.send("dummy server started");
});

app.get('/reqheaders', async (req: Request, res: Response) => {
  let headers = req.headers;
  headers.ip = await getMyPublicIP();
  res.send(headers);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});