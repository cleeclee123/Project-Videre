import {
  ChildProcessWithoutNullStreams,
  spawn,
  spawnSync,
  ChildProcess,
} from "child_process";
import process from "node:process";
import * as util from "util";
import { createRequire } from "module";

/**
 * @todo: Ping generated ip address, determine if address is useable for proxy, push into set
 * @references
 *  - https://nodejs.org/api/dns.html
 *  - https://whatismyipaddress.com/ip-lookup (build own api)
 *  - https://stackoverflow.com/questions/4737130/how-to-ping-from-a-node-js-app
 *  - https://stackoverflow.com/questions/20643470/execute-a-command-line-binary-with-node-js
 *  - https://nodejs.org/docs/v8.1.4/api/child_process.html#child_process_child_process_spawn_command_args_options
 */

type Packets = {
  sent: number;
  received: number;
  lost: number;
  rate: number;
};

const require = createRequire(import.meta.url);
const exec = util.promisify(require("child_process").exec);

export const ping = async (host: any) => {
  const { stdout, stderr } = await exec(`ping ${host}`);
  console.log(stdout);
  console.log(stderr);
};

export const pingChuck = (host: any, numberPacket: any) => {
  const ping = spawn("ping", [host, "-n", numberPacket]);

  ping.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  ping.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`);
  });

  ping.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });

  ping.on("SIGINT", () => {
    console.log("here");
  });
};

// check response from live output, still slow af tho on non-responsive servers
export const checkResponse = (host: any) => {
  const kPackets: string = "1";
  const kTimeout: string = "1000" // 1 second
  const ping: ChildProcessWithoutNullStreams = spawn(
    "ping",
    [host, "-n", kPackets, "-w", kTimeout],
    { detached: true }
  );

  return new Promise((resolve, reject) => {
    // stream standard output
    ping.stdout.setEncoding("utf8");
    ping.stdout.on("data", async (data) => {
      console.log(`stdout: ${data}`);

      // server doesnt send response back
      if (String(data).toLowerCase().includes("request")) {
        resolve(false);
        ping.kill("SIGKILL");
      }
      // server sends response back
      if (String(data).toLowerCase().includes("reply")) {
        resolve(true);
        ping.kill("SIGKILL");
      }
    });

    // handling errors, just return false
    ping.stderr.on("data", async (data) => {
      console.log(data);
      reject(new Error("spawn process error"))
      ping.kill("SIGKILL");
    });

    // handle spawn exit
    ping.on("exit", async (code) => {
      console.log(`process exited with ${code}`);
    });
  });
};

/**
 * builds packet object to be used in parsing all ip addresses
 * sends 3 packets to server
 * @param host, passed in ip address
 */
const getPackets = (host: any) => {
  const kPackets: number = 3;
  const ping: ChildProcessWithoutNullStreams = spawn("ping", [
    `${host} -n ${kPackets}`,
  ]);

  // stream standard output
  ping.stdout.on("data", (data) => {
    if (String(data).toLowerCase().includes("request time out")) {
      return false;
    }
    if (String(data).toLowerCase().includes("")) {
    }
  });

  // handling errors, just return false
  ping.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`);
    return false;
  });

  // handle stream close, nothing to do
  ping.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
};
