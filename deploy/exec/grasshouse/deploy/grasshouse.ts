/*
 * @Description: 
 * @Author: Hungry
 * @Date: 2022-05-05 11:31:10
 * @LastEditors: Hungry
 * @LastEditTime: 2022-05-19 14:58:04
 */
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers, upgrades } from "hardhat";
import { GrassHouse, GrassHouse__factory } from "../../../../typechain";
import { ConfigEntity } from "../../../entities";
import { getDeployer } from "../../../../utils/deployer-helper";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  interface IGrassHouse {
    SYMBOL: string;
    TOKEN_ADDRESS: string;
    START_TIME: string;
  }
  /*
      ░██╗░░░░░░░██╗░█████╗░██████╗░███╗░░██╗██╗███╗░░██╗░██████╗░
      ░██║░░██╗░░██║██╔══██╗██╔══██╗████╗░██║██║████╗░██║██╔════╝░
      ░╚██╗████╗██╔╝███████║██████╔╝██╔██╗██║██║██╔██╗██║██║░░██╗░
      ░░████╔═████║░██╔══██║██╔══██╗██║╚████║██║██║╚████║██║░░╚██╗
      ░░╚██╔╝░╚██╔╝░██║░░██║██║░░██║██║░╚███║██║██║░╚███║╚██████╔╝
      ░░░╚═╝░░░╚═╝░░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝╚═╝╚═╝░░╚══╝░╚═════╝░
      Check all variables below before execute the deployment script
  */
      
  const CHECKPOINT_WHITELIST: string[] = [process.env.FANTOM_TESTNET_OPERATOR!];
  const GRASSHOUSES: Array<IGrassHouse> = [
    { SYMBOL: "MOLE", TOKEN_ADDRESS: "0x3e3e6b73D29178844Ea725e25C4bD653D77b8492", START_TIME: "1652918400" },
  ];

  const config = ConfigEntity.getConfig();
  const deployer = await getDeployer();

  for (const grassHouseConfig of GRASSHOUSES) {
    console.log(`>> Deploying GrassHouse ${grassHouseConfig.SYMBOL}`);
    const GrassHouse = (await ethers.getContractFactory("GrassHouse", deployer)) as GrassHouse__factory;
    const grassHouse = (await upgrades.deployProxy(GrassHouse, [
      config.xMOLE,
      grassHouseConfig.START_TIME,
      grassHouseConfig.TOKEN_ADDRESS,
      await deployer.getAddress(),
    ])) as GrassHouse;
    await grassHouse.deployed();
    const deployTx = await grassHouse.deployTransaction.wait(3);
    console.log(`>> Deployed at ${grassHouse.address}`);
    console.log(`>> Deployed at: `, deployTx.blockNumber);
    console.log("✅ Done");

    console.log(">> Whitelist checkpoint token");
    const whitelistTx = await grassHouse.setWhitelistedCheckpointCallers(CHECKPOINT_WHITELIST, true);
    await whitelistTx.wait(3);
    console.log("✅ Done");
  }
};

export default func;
func.tags = ["GrassHouse"];
