import { ethers, run } from "hardhat";

const main = async () => {
  const [deployer] = await ethers.getSigners();

  await run("verify:verify", {
    address: "0x8e71a0d2CC9c48173D9a9b7d90D6036093212aFa",
    constructorArguments: [
      "0x886516b01cc57C8252Bc756D3c4110dcf0a55C24",
      48 * 3600,
    ],
  });

  await run("verify:verify", {
    address: "0x5DfD4fC7347c9eAF09b9120Fb11899a9c830Dea4",
    constructorArguments: [],
  });

  await run("verify:verify", {
    address: "0x886516b01cc57C8252Bc756D3c4110dcf0a55C24",
    constructorArguments: [
      "0x8e71a0d2CC9c48173D9a9b7d90D6036093212aFa",
      "0x79e2d470f950f2cf78eef41720e8ff2cf4b3cd78",
      deployer.address,
      "0x8e71a0d2CC9c48173D9a9b7d90D6036093212aFa",
      "0x5DfD4fC7347c9eAF09b9120Fb11899a9c830Dea4",
      5760,
      1,
      10,
      200,
    ],
  });
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
