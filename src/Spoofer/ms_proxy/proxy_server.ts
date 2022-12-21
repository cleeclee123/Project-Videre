import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createProxyMiddleware } from "http-proxy-middleware";

export class Server {
  public app_: express.Application;
  private router_: express.Router;
  private localPort_: number;
  // private host_: string;
  // private proxyPort_: number;

  constructor(localPort: number /* , host: string, proxyPort: number */) {
    this.app_ = express();
    this.router_ = express.Router();
    this.localPort_ = localPort;
    // this.host_ = host;
    // this.proxyPort_ = proxyPort;
    this.config();
    this.proxyRoutes();
  }

  private config(): void {
    this.app_.set("port", this.localPort_);
    this.app_.use(bodyParser.json());
    this.app_.use(bodyParser.urlencoded({ extended: false }));
    this.app_.use(this.router_);
  }

  private proxyRoutes = (): void => {
    this.router_.use(cors());
    this.app_.use(cors());
    this.router_.use(express.json());
    this.app_.use(express.json());
    
    this.app_.get("/", (request, response) => {
      // response.render('index', {});
      response.send("proxy service entry point");
    });

    // for the basic test
    this.router_.use(
      "/placeholder_basic",
      createProxyMiddleware({
        target: "https://httpbin.org/ip",
        changeOrigin: true,
        pathRewrite: {
          [`^/placeholder_basic`]: "",
        },
      })
    );

    // for the google test
    this.router_.use(
      "/placeholder_google",
      createProxyMiddleware({
        target: "https://www.google.com/",
        changeOrigin: true,
        pathRewrite: {
          [`^/placeholder_google`]: "",
        },
      })
    );
  };

  public start = (): void => {
    this.app_.listen(this.localPort_);
    console.log(`Server listening in port ${this.localPort_}`);
  };
}

let server = new Server(3001);
server.start();