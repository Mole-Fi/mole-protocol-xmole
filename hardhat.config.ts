/*
 * @Description: 
 * @Author: Hungry
 * @Date: 2022-05-04 19:50:51
 * @LastEditors: Hungry
 * @LastEditTime: 2022-05-24 15:48:19
 */
import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-waffle";
import "hardhat-typechain";
import "hardhat-deploy";
import "solidity-coverage";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      gas: 12000000,
      blockGasLimit: 0x1fffffffffffff,
      allowUnlimitedContractSize: true,
      timeout: 1800000,
      accounts: { mnemonic: "test test test test test test test test test test test junk" },
    },
    avalanche_testnet : {
      url: process.env.AVALANCHE_TESTNET_PRC,
      accounts: [
        process.env.AVALANCHE_TESTNET_PRIVATE_KEY
      ]
    }
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  solidity: {
    version: "0.8.10",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts/8.10",
    tests: "./tests/unit",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  typechain: {
    outDir: "./typechain",
    target: "ethers-v5",
  },
  mocha: {
    timeout: 50000,
  },
};
