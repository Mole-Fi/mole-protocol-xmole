/*
 * @Description: 
 * @Author: Hungry
 * @Date: 2022-05-05 11:31:10
 * @LastEditors: Hungry
 * @LastEditTime: 2022-05-24 15:48:10
 */
import { network } from "hardhat";
import AvalancheTestnetConfig from "../../.avalanche_testnet.json";
import { Config } from "../interfaces/config";

export function getConfig(): Config {
  if(network.name === "avalanche_testnet"){
    return AvalancheTestnetConfig;
  }
  throw new Error("not found config");
}
