type GenIP = {
  netid: number;
  ipaddress: string;
  class: string;
};

/**
 * This example returns a random number between the specified values. The returned value is no lower than (and may possibly equal) min, and is less than (and not equal) max.
 * @param min lower bound inclusive
 * @param max upper bound non-inclusive
 */
const getRandomArbitrary = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
};

// large network of hosts
export const generateClassA = (): GenIP => {
  // 127.xxx.xxx.xxx reserved for loopback and diagnostic functions
  let netID: number = getRandomArbitrary(1, 127);
  let classAIP = `${netID}.${getRandomArbitrary(0, 256)}.${getRandomArbitrary(
    0,
    256
    )}.${getRandomArbitrary(0, 256)}`;
  
  let classA = {} as GenIP;
  classA.netid = netID;
  classA.ipaddress = classAIP;
  classA.class = "class a";

  return classA;
};

// medium sized networks
export const generateClassB = (): GenIP => {
  let netID: number = getRandomArbitrary(128, 192);
  let classBIP = `${netID}.${getRandomArbitrary(0, 256)}.${getRandomArbitrary(
    0,
    256
  )}.${getRandomArbitrary(0, 256)}`;

  let classB = {} as GenIP;
  classB.netid = netID;
  classB.ipaddress = classBIP;
  classB.class = "class b";
  
  return classB;
};

// local area network
export const generateClassC = (): GenIP => {
  let netID: number = getRandomArbitrary(192, 224);
  let classCIP = `${netID}.${getRandomArbitrary(0, 256)}.${getRandomArbitrary(
    0,
    256
  )}.${getRandomArbitrary(0, 256)}`;

  let classC = {} as GenIP;
  classC.netid = netID;
  classC.ipaddress = classCIP;
  classC.class = "class c";
  
  return classC;
};

// reversed for multi-tasking
export const generateClassD = (): GenIP => {
  let netID: number = getRandomArbitrary(224, 239);
  let classDIP = `${netID}.${getRandomArbitrary(0, 256)}.${getRandomArbitrary(
    0,
    256
  )}.${getRandomArbitrary(0, 256)}`;

  let classD = {} as GenIP;
  classD.netid = netID;
  classD.ipaddress = classDIP;
  classD.class = "class d";

  return classD;
};

/**.
 * generates random ip address, idk if it works tho, just for fun
 * @todo: 
 *    - generate every ip address in a class
 *      - just four lopps
 * @return string that resembles an iv4 ip address
 */
export const generateIP = () => {};
