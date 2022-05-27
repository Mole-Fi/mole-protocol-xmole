/*
 * @Description: 
 * @Author: Hungry
 * @Date: 2022-05-05 11:31:10
 * @LastEditors: Hungry
 * @LastEditTime: 2022-05-05 15:28:04
 */
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers, upgrades } from "hardhat";
import { GrassHouse, GrassHouse__factory } from "../../../../typechain";
import { ConfigEntity } from "../../../entities";
import { getDeployer } from "../../../../utils/deployer-helper";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  interface IGrassHouse {
    NAME: string;
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
  const GRASSHOUSES: Array<IGrassHouse> = [{ NAME: "MOLE" }];

  const config = ConfigEntity.getConfig();

  const deployer = await getDeployer();

  for (const grassHouseConfig of GRASSHOUSES) {
    const grasshouse = config.GrassHouses.find((gh) => {
      return gh.name === grassHouseConfig.NAME;
    });
    if (!grasshouse) {
      console.log(`>> ${grassHouseConfig.NAME} GrassHouse not found`);
      continue;
    }
    console.log(`>> Checking point GrassHouse ${grasshouse.name}`);
    const grassHouseAsDeployer = GrassHouse__factory.connect(grasshouse.address, deployer);
    await grassHouseAsDeployer.checkpointToken();
    console.log(`✅ Done checkpoint for ${grasshouse.name} at ${grasshouse.address}`);
  }
};

export default func;
func.tags = ["GrassHouseCheckpoint"];
