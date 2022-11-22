import { spawn } from "child_process";
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

const require = createRequire(import.meta.url);
const exec = util.promisify(require("child_process").exec);

const ping = async (host: any) => {
  const { stdout, stderr } = await exec(`ping ${host}`);
  console.log(stdout);
  console.log(stderr);
};


const pingChuck = (host: any) => {
  const ping = spawn('ping', [host]);

  ping.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  
  ping.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
  
  ping.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

