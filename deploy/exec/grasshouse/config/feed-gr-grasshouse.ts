/*
 * @Description: 
 * @Author: Hungry
 * @Date: 2022-05-05 11:31:10
 * @LastEditors: Hungry
 * @LastEditTime: 2022-05-06 15:30:15
 */
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers, upgrades } from "hardhat";
import { BEP20__factory, GrassHouse, GrassHouse__factory } from "../../../../typechain";
import { ConfigEntity } from "../../../entities";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  interface IGrassHouse {
    NAME: string;
    AMOUNT: string;
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
  const GRASSHOUSES: Array<IGrassHouse> = [
    { NAME: "MOLE", AMOUNT: '100' },
    // { NAME: "", AMOUNT: "" },
  ];

  const deployer = (await ethers.getSigners())[0];
  const config = ConfigEntity.getConfig();

  for (const grassHouseConfig of GRASSHOUSES) {
    const grasshouse = config.GrassHouses.find((gh) => {
      return gh.name === grassHouseConfig.NAME;
    });
    if (!grasshouse) {
      console.log(`>> ${grassHouseConfig.NAME} GrassHouse not found`);
      continue;
    }
    console.log(
      `>> Feeding ${grassHouseConfig.AMOUNT} ${grasshouse.name} to GrassHouse ${grasshouse.name} at ${grasshouse.address}`
    );
    const grassHouseTokenAsDeployer = BEP20__factory.connect(grasshouse.rewardToken, deployer);
    const grassHouseAsDeployer = GrassHouse__factory.connect(grasshouse.address, deployer);

    let tx = await grassHouseTokenAsDeployer.approve(grasshouse.address, ethers.utils.parseEther(grassHouseConfig.AMOUNT));
    await tx.wait()
    console.log('>> approve ok.')

    tx = await grassHouseAsDeployer.feed(ethers.utils.parseEther(grassHouseConfig.AMOUNT));
    await tx.wait()
    console.log('>> feed ok')
    
    console.log(
      `✅ Done Feed ${grassHouseConfig.AMOUNT} ${grasshouse.name} to GrassHouse ${grasshouse.name} at ${grasshouse.address}`
    );
  }
};

export default func;
func.tags = ["GrassHouseFeed"];
