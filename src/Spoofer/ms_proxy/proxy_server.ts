import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createProxyMiddleware } from "http-proxy-middleware";

export class Server {
  public app_: express.Application;
  // private router_: express.Router;
  private port_: number;

  constructor(port: number) {
    this.app_ = express();
    // this.router_ = express.Router();
    this.port_ = port;
    this.config();
    this.proxyRoutes();
  }

  private config(): void {
    this.app_.set("port", this.port_);
    this.app_.use(bodyParser.json());
    this.app_.use(bodyParser.urlencoded({ extended: false }));
  }

  private proxyRoutes = (): void => {
    // this.router_.use(cors());
    // this.router_.use(express.json());

    this.app_.use(cors());
    this.app_.use(express.json());

    this.app_.get("/", async (request, response) => {
      // response.render('index', {});
      response.send("proxy service entry point");
    });

    this.app_.use(
      "placeholder",
      createProxyMiddleware({
        target: "https://httpbin.org/ip",
        changeOrigin: true,
        pathRewrite: {
          [`^/placeholder`]: "",
        },
      })
    );
  };

  public start = (): void => {
    this.app_.listen(this.port_),
      () => {
        console.log(`Server listening in port ${this.port_}`);
      };
  };
}
