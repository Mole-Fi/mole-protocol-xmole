/*
 * @Description: 
 * @Author: Hungry
 * @Date: 2022-05-05 11:31:10
 * @LastEditors: Hungry
 * @LastEditTime: 2022-05-16 15:10:35
 */
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers, upgrades, network } from "hardhat";
import { getConfig } from "../../../entities/config";
import { GrassHouse__factory, XMOLE__factory } from "../../../../typechain";
import { Manifest, getAdminAddress, getCode } from '@openzeppelin/upgrades-core';

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

  const [deployer] = await ethers.getSigners();
  const config = getConfig();
  const xMoleAddress = config.xMOLE

  return 
  
  const xMole = XMOLE__factory.connect(xMoleAddress,deployer)

  const manifest = await Manifest.forNetwork(ethers.provider);
  // const AdminFactory = await getProxyAdminFactory(hre, signer);
  // const admin = AdminFactory.attach(adminAddress);
  const manifestAdmin = await manifest.getAdmin();
  console.log(manifestAdmin?.address)
  
  const NewXMOLEFactory = (await ethers.getContractFactory("xMOLE")) as XMOLE__factory;
  const preparedNewXMOLE = await upgrades.prepareUpgrade(xMole, NewXMOLEFactory);
  await upgrades.upgradeProxy(xMole,NewXMOLEFactory,{})
};

export default func;
func.tags = ["UpgradeXMOLEWithoutTimelock"];
