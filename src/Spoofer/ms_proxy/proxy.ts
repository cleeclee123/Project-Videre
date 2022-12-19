import * as net from "net";

/**
 * attempts to connect to socket with passed in ip address on passed in port
 * resolves promise to true right away if port is open, to false if port is closed
 * @param host, passed in ip address (string)
 * @param port, passed in port number (string but node net wants it a number)
 */
export const checkPort = (
  host: string,
  port: string,
  millis: number
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // opens socket connection
    let connection: net.Socket = net.connect(Number(port), host, () => {
      connection.destroy();
      resolve(true);
    });

    // handle timeout error
    setTimeout(() => {
      connection.destroy();
      resolve(false);
    }, millis);

    // handle socket connection error
    connection.on("error", (error) => {
      console.log("error");
      resolve(false);
    });
  });
};

/**
 * callback/promise helper to build proxy
 * @param host 
 * @param port 
 * @returns Promise<String> proxy string
 */
export const buildProxyHelper = async (
  host: string,
  port: string
): Promise<String> => {
  return await checkPort(host, port, 1000).then((data) => {
    if (data) {
      if (port === String(443)) {
        return `https://${host}:${String(port)}`;
      } else {
        return `http://${host}:${String(port)}`;
      }
    }
    return "";
  });
};

/**
 * loops thru http(s) ports and checks if able to connect, 
 * @param host 
 * @returns Promise<Array<String>> array of proxies associated with the host
 */
export const buildProxy = async (host: string): Promise<Array<String>> => {
  const kHttpPorts: Array<number> = [80, 8080, 8008, 443];
  let resPromise = await Promise.all(
    kHttpPorts.map((port) => {
      return buildProxyHelper(host, String(port));
    })
  );
  return resPromise.filter(e => e !== "");
};
