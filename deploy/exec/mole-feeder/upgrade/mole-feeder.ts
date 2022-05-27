// import { HardhatRuntimeEnvironment } from "hardhat/types";
// import { DeployFunction } from "hardhat-deploy/types";
// import { ethers, upgrades, network } from "hardhat";
// import { getConfig } from "../../../entities/config";
// import { MoleFeeder__factory } from "../../../../typechain";
// import { Timelock__factory } from "@mole-finance/mole-contract/typechain";

// const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
//   const EXACT_ETA = "1640923200";

//   const [deployer] = await ethers.getSigners();
//   const config = getConfig();
//   const timelock = Timelock__factory.connect(config.Timelock, deployer);

//   console.log(`============`);
//   console.log(`>> Upgrading Mole Feeder at ${config.MOLEFeeder} through Timelock + ProxyAdmin`);
//   console.log(">> Prepare upgrade & deploy if needed a new IMPL automatically.");
//   const MoleFeeder = (await ethers.getContractFactory("MoleFeeder")) as MoleFeeder__factory;
//   const preparedNewMoleFeeder = await upgrades.prepareUpgrade(config.MOLEFeeder, MoleFeeder);
//   console.log(`>> Implementation address: ${preparedNewMoleFeeder}`);
//   console.log("✅ Done");

//   console.log(`>> Queue tx on Timelock to upgrade the implementation`);
//   await timelock.queueTransaction(
//     config.ProxyAdmin,
//     "0",
//     "upgrade(address,address)",
//     ethers.utils.defaultAbiCoder.encode(["address", "address"], [config.MOLEFeeder, preparedNewMoleFeeder]),
//     EXACT_ETA
//   );
//   console.log("✅ Done");

//   console.log(`>> Generate executeTransaction:`);
//   console.log(
//     `await timelock.executeTransaction('${config.ProxyAdmin}', '0', 'upgrade(address,address)', ethers.utils.defaultAbiCoder.encode(['address','address'], ['${config.MOLEFeeder}','${preparedNewMoleFeeder}']), ${EXACT_ETA})`
//   );
//   console.log("✅ Done");
// };

// export default func;
// func.tags = ["UpgradeMoleFeeder"];
