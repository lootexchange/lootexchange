import { getContractAddress } from "@ethersproject/address";
import { Contract } from "@ethersproject/contracts";
import { ethers } from "hardhat";

const main = async () => {
  const [deployer] = await ethers.getSigners();

  const loot = await ethers.getContractAt(
    "IERC721Enumerable",
    "0x79e2d470f950f2cf78eef41720e8ff2cf4b3cd78"
  );

  const daoProxyAddress = getContractAddress({
    from: deployer.address,
    // Nonce that will get used to deploy LootDAOProxy
    nonce: (await deployer.getTransactionCount()) + 2,
  });

  // Deploy LootDAOExecutor
  const executorFactory = await ethers.getContractFactory(
    "LootDAOExecutor",
    deployer
  );
  const executor = await executorFactory.deploy(
    daoProxyAddress,
    // Delay before executing any transaction
    48 * 3600
  );
  await executor.deployTransaction.wait();

  console.log(`Executor deployed at ${executor.address}`);

  // Deploy LootDAOLogic
  const daoLogicFactory = await ethers.getContractFactory(
    "LootDAOLogicV1",
    deployer
  );
  const daoLogic = await daoLogicFactory.deploy();
  await daoLogic.deployTransaction.wait();

  console.log(`LootDAOLogic deployed at ${daoLogic.address}`);

  // Deploy LootDAOProxy
  const daoProxyFactory = await ethers.getContractFactory(
    "LootDAOProxy",
    deployer
  );
  const daoProxy = await daoProxyFactory.deploy(
    // Executor contract
    executor.address,
    // Loot token
    loot.address,
    // Vetoer (can cancel proposals that were not yet executed)
    deployer.address,
    // Admin (can change implementation - eg. updating the logic contract)
    executor.address,
    // Logic contract
    daoLogic.address,
    // Voting period (in blocks)
    5760,
    // Voting delay - time between actions being proposed and votes being allowed on the proposal (in blocks)
    1,
    // Proposal threshold BPS (percentage of tokens proposer must hold)
    10, // 0.1% of totalSupply
    // Quorum votes BPS (percentage of tokens that must vote in support of a proposal to have it accepted)
    200 // 2% of totalSupply
  );
  await daoProxy.deployTransaction.wait();

  console.log(`LootDAOProxy deployed at ${daoProxy.address}`);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
