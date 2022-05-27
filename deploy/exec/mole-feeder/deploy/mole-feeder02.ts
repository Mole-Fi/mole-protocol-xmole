/*
 * @Description: 
 * @Author: Hungry
 * @Date: 2022-05-05 11:31:10
 * @LastEditors: Hungry
 * @LastEditTime: 2022-05-05 11:54:32
 */
/*
 * @Description: 
 * @Author: Hungry
 * @Date: 2022-05-05 11:31:10
 * @LastEditors: Hungry
 * @LastEditTime: 2022-05-05 11:42:57
 */
import { MoleFeeder02__factory } from "../../../../typechain/factories/MoleFeeder02__factory";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers, upgrades } from "hardhat";
import {
  MoleFeeder,
  MoleFeeder02,
  MoleFeeder__factory,
  ProxyToken,
  ProxyToken__factory,
} from "../../../../typechain";
import { ConfigEntity } from "../../../entities";
import { getDeployer } from "../../../../utils/deployer-helper";

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
  const POOL_ID = "8";

  const config = ConfigEntity.getConfig();
  const deployer = await getDeployer();

  const moleGrassHouseAddress = config.GrassHouses.find((gh) => gh.name === "MOLE");
  if (moleGrassHouseAddress === undefined) throw new Error(`could not find MOLE GrassHouse`);
  if (config.Tokens.fdMOLE === undefined) throw new Error(`could not find config.Tokens.fdMOLE`);
  if (config.MiniFL === undefined) throw new Error(`could not find config.MiniFL`);

  console.log(`>> Deploying MoleFeeder02`);
  const MoleFeeder = (await ethers.getContractFactory("MoleFeeder02", deployer)) as MoleFeeder02__factory;
  const moleFeeder = (await upgrades.deployProxy(MoleFeeder, [
    config.Tokens.MOLE,
    config.Tokens.fdMOLE,
    config.MiniFL.address,
    POOL_ID,
    moleGrassHouseAddress.address,
  ])) as MoleFeeder02;
  await moleFeeder.deployTransaction.wait(3);
  console.log(`>> Deployed molefeeder02 at ${moleFeeder.address}`);
  console.log("✅ Done");

  let nonce = await deployer.getTransactionCount();

  console.log(">> Transferring ownership and set okHolders of proxyToken to be moleFeeder");
  const proxyToken = ProxyToken__factory.connect(config.Tokens.fdMOLE, deployer);
  await proxyToken.setOkHolders([moleFeeder.address, config.MiniFL.address], true, { nonce: nonce++ });
  await proxyToken.transferOwnership(moleFeeder.address, { nonce: nonce++ });
  console.log("✅ Done");

  console.log(">> Depositing proxyToken to MiniFL pool");
  await moleFeeder.miniFLDeposit({ nonce: nonce++ });
  console.log("✅ Done");
};

export default func;
func.tags = ["MoleFeeder02"];
