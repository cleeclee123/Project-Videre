import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import * as util from "util";
import { createRequire } from "module";
import * as net from "net";

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
};

/**
 * check response by spawning child process and running ping command on passed in ip address, with live terminal output to console
 * pretty fast at getting response (time to server + sub 100 ms), still slow af tho on non-responsive servers (1000-1500 ms)
 * Notes:
 *  - ping commannd, unrealiable to determine if servers are up, lack of evidennce is not evidence of absnece
 *  - function resolves promise right away after parsing output, kills child process with SIGKILl signal
 * @param host, ip address to be ping (string)
 * @returns Promise<boolean> true if server is up, false if no response/timeout from ping
 */
export const checkResponse = (host: string): Promise<boolean> => {
  // using spawn over exec, Spawn returns a childObject, listening for events
  // flags: -n number of packets sent, -w wait until timeout
  const kPackets: string = "1";
  const kTimeout: string = "1000"; // 1 second
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
      reject(new Error("spawn process error"));
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
 * sends 3 packets to server, idk why i made this function
 * @param host, passed in ip address (string)
 * @param numPackets, number of packets sent to passed in server
 * @return PingResponse
 */
type PingResponse = {
  sent: number; // packets sent
  received: number; // replies received
  lost: number; // pakcets lost
  rate: number; // loss rate of packets sent
  output: string; // output of process
};

export const getPackets = (host: string, numPackets: number) => {
  let response = {} as PingResponse;
  response.sent = numPackets;

  const ping: ChildProcessWithoutNullStreams = spawn("ping", [
    `${host} -n ${numPackets}`,
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