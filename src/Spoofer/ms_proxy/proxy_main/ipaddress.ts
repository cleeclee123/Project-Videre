import { IPInfo } from "../types.js";

/**
 * This example returns a random number between the specified values. The returned value is no lower than (and may possibly equal) min, and is less than (and not equal) max.
 * @param min lower bound inclusive
 * @param max upper bound non-inclusive
 */
export const getRandomArbitrary = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
};

// large network of hosts
// 127.xxx.xxx.xxx reserved for loopback and diagnostic functions
export const generateClassA = (): IPInfo => {
  let classA = {} as IPInfo;
  let firstOctet: number = getRandomArbitrary(1, 127);
  let subnet: number = getRandomArbitrary(0, 256);
  let generatedClassA: string = `${firstOctet}.${getRandomArbitrary(
    0,
    256
  )}.${subnet}.${getRandomArbitrary(0, 256)}`;

  classA.firstOctet = firstOctet;
  classA.subnet = subnet;
  classA.ipaddress = generatedClassA;
  classA.class = "Class A";
  return classA;
};

// medium sized networks
export const generateClassB = (): IPInfo => {
  let classB = {} as IPInfo;
  let firstOctet: number = getRandomArbitrary(128, 192);
  let subnet: number = getRandomArbitrary(0, 256);
  let generatedClassB: string = `${firstOctet}.${getRandomArbitrary(
    0,
    256
  )}.${subnet}.${getRandomArbitrary(0, 256)}`;

  classB.firstOctet = firstOctet;
  classB.subnet = subnet;
  classB.ipaddress = generatedClassB;
  classB.class = "class b";
  return classB;
};

// local area network
export const generateClassC = (): IPInfo => {
  let classC = {} as IPInfo;
  let firstOctet: number = getRandomArbitrary(192, 224);
  let subnet: number = getRandomArbitrary(0, 256);
  let generatedClassC: string = `${firstOctet}.${getRandomArbitrary(
    0,
    256
  )}.${subnet}.${getRandomArbitrary(0, 256)}`;

  classC.firstOctet = firstOctet;
  classC.subnet = subnet;
  classC.ipaddress = generatedClassC;
  classC.class = "class c";
  return classC;
};

// reversed for multi-tasking
export const generateClassD = (): IPInfo => {
  let classD = {} as IPInfo;
  let firstOctet: number = getRandomArbitrary(224, 239);
  let subnet: number = getRandomArbitrary(0, 256);
  let generatedClassD: string = `${firstOctet}.${getRandomArbitrary(
    0,
    256
  )}.${subnet}.${getRandomArbitrary(0, 256)}`;

  classD.firstOctet = firstOctet;
  classD.subnet = subnet;
  classD.ipaddress = generatedClassD;
  classD.class = "class d";
  return classD;
};
