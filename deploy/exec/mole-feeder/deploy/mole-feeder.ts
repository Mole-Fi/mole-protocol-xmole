/*
 * @Description: 
 * @Author: Hungry
 * @Date: 2022-05-05 11:31:10
 * @LastEditors: Hungry
 * @LastEditTime: 2022-05-19 15:26:11
 */
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers, upgrades } from "hardhat";
import { MoleFeeder, MoleFeeder__factory, ProxyToken, ProxyToken__factory } from "../../../../typechain";
import { ConfigEntity } from "../../../entities";

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
  const POOL_ID = "10";
  const fairLaunchAddress = "0xE0FCb9AFAcf0b7a1435B253F2d337a6DcE8d4708";

  const config = ConfigEntity.getConfig();
  const deployer = (await ethers.getSigners())[0];
  let nonce = await deployer.getTransactionCount();

  const moleGrassHouseAddress = config.GrassHouses.find((gh) => gh.name === "MOLE");
  if (moleGrassHouseAddress === undefined) throw new Error(`could not find MOLE GrassHouse`);
  if (config.Tokens.fdMOLE === undefined) throw new Error(`could not find config.Tokens.fdMOLE`);
  if (fairLaunchAddress === undefined) throw new Error(`could not find config.FairLaunch`);

  console.log(`>> Deploying MoleFeeder`);
  const MoleFeeder = (await ethers.getContractFactory("MoleFeeder", deployer)) as MoleFeeder__factory;
  const moleFeeder = (await upgrades.deployProxy(MoleFeeder, [
    config.Tokens.MOLE,
    config.Tokens.fdMOLE,
    fairLaunchAddress,
    POOL_ID,
    moleGrassHouseAddress.address,
  ])) as MoleFeeder;
  await moleFeeder.deployed();
  nonce++;
  console.log(`>> Deployed at ${moleFeeder.address}`);
  console.log("✅ Done");

  console.log(">> Transferring ownership and set okHolders of proxyToken to be moleFeeder");
  const proxyToken = ProxyToken__factory.connect(config.Tokens.fdMOLE, deployer);
  await proxyToken.setOkHolders([moleFeeder.address, fairLaunchAddress], true, { nonce: nonce++ });
  await proxyToken.transferOwnership(moleFeeder.address, { nonce: nonce++ });
  console.log("✅ Done");

  console.log(">> Sleep for 10000msec waiting for moleFeeder to completely deployed");
  await new Promise((resolve) => setTimeout(resolve, 10000));
  console.log("✅ Done");

  console.log(">> Depositing proxyToken to Fairlaunch pool");
  await moleFeeder.fairLaunchDeposit({ nonce });
  console.log("✅ Done");
};

export default func;
func.tags = ["MoleFeeder"];
