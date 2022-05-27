/*
 * @Description: 
 * @Author: Hungry
 * @Date: 2022-05-05 11:31:10
 * @LastEditors: Hungry
 * @LastEditTime: 2022-05-06 17:24:15
 */
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers, upgrades, network } from "hardhat";
import { getConfig } from "../../../entities/config";
import { GrassHouse__factory } from "../../../../typechain";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
      ░██╗░░░░░░░██╗░█████╗░██████╗░███╗░░██╗██╗███╗░░██╗░██████╗░
      ░██║░░██╗░░██║██╔══██╗██╔══██╗████╗░██║██║████╗░██║██╔════╝░
      ░╚██╗████╗██╔╝███████║██████╔╝██╔██╗██║██║██╔██╗██║██║░░██╗░
      ░░████╔═████║░██╔══██║██╔══██╗██║╚████║██║██║╚████║██║░░╚██╗
      ░░╚██╔╝░╚██╔╝░██║░░██║██║░░██║██║░╚███║██║██║░╚███║╚██████╔╝
      ░░░╚═╝░░░╚═╝░░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝╚═╝╚═╝░░╚══╝░╚═════╝░
      Check all variables below before execute the deployment script
  */
  const EXACT_ETA = "1641384000";

  const [deployer] = await ethers.getSigners();
  const config = getConfig();

  return 

  for (const grasshouse of config.GrassHouses) {
    console.log(`============`);
    console.log(`>> Upgrading grasshouse at ${grasshouse.address} through ProxyAdmin without Timelock`);
    const GrassHouse = (await ethers.getContractFactory("GrassHouse")) as GrassHouse__factory;
    const preparedNewGrassHouse = await upgrades.prepareUpgrade(grasshouse.address, GrassHouse);
    console.log(`>> Implementation address: ${preparedNewGrassHouse}`);
    console.log("✅ Done");

    console.log(`>> Queue tx on Timelock to upgrade the implementation`);
    await upgrades.upgradeProxy(grasshouse.address,GrassHouse)
    console.log("✅ Done");

    console.log(`>> Generate executeTransaction:`);
    console.log(
      `await timelock.executeTransaction('${config.ProxyAdmin}', '0', 'upgrade(address,address)', ethers.utils.defaultAbiCoder.encode(['address','address'], ['${grasshouse.address}','${preparedNewGrassHouse}']), ${EXACT_ETA})`
    );
    console.log("✅ Done");
  }
};

export default func;
func.tags = ["UpgradeGrassHouseWithoutTimelock"];
