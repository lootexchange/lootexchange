import { getContractAddress } from "@ethersproject/address";
import { Contract } from "@ethersproject/contracts";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumberish } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";
import { ethers, network } from "hardhat";

describe("Governance", () => {
  let deployer: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;

  let loot: Contract;

  let executor: Contract;
  let daoLogic: Contract;
  let daoProxy: Contract;

  let snapshotId: number;

  // Create a mock proposal
  const propose = async (proposer: SignerWithAddress) => {
    const targets = [loot.address];
    const values = [0];
    const signatures = [loot.interface.getSighash("balanceOf(address)")];
    const calldatas = [defaultAbiCoder.encode(["address"], [loot.address])];
    const description = "";

    return proposer.sendTransaction({
      to: daoProxy.address,
      data: daoLogic.interface.encodeFunctionData("propose", [
        targets,
        values,
        signatures,
        calldatas,
        description,
      ]),
    });
  };

  beforeEach(async () => {
    snapshotId = await ethers.provider.send("evm_snapshot", []);

    [deployer, alice, bob] = await ethers.getSigners();

    loot = await ethers.getContractAt(
      "IERC721Enumerable",
      "0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7"
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
    executor = await executorFactory.deploy(
      daoProxyAddress,
      // Delay before executing any transaction
      48 * 3600
    );

    // Deploy LootDAOLogic
    const daoLogicFactory = await ethers.getContractFactory(
      "LootDAOLogicV1",
      deployer
    );
    daoLogic = await daoLogicFactory.deploy();

    // Deploy LootDAOProxy
    const daoProxyFactory = await ethers.getContractFactory(
      "LootDAOProxy",
      deployer
    );
    daoProxy = await daoProxyFactory.deploy(
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
  });

  afterEach(async () => {
    await ethers.provider.send("evm_revert", [snapshotId]);
  });

  describe("deployment", () => {
    it("contracts are correctly configured", async () => {
      const executorAdmin = await executor.admin();
      expect(executorAdmin.toLowerCase()).to.be.equal(
        daoProxy.address.toLowerCase()
      );

      const proxyAdmin = await daoProxy.admin();
      expect(proxyAdmin.toLowerCase()).to.be.equal(
        executor.address.toLowerCase()
      );

      const implementation = await daoProxy.implementation();
      expect(implementation.toLowerCase()).to.be.equal(
        daoLogic.address.toLowerCase()
      );
    });
  });

  describe("propose", () => {
    it("successfully propose if proposer owns more tokens than proposal threshold", async () => {
      const bigHolderAddress = "0x28b8d4f7516a112e2e2fd462293a1c27cde327a7";
      await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [bigHolderAddress],
      });
      const bigHolder = await ethers.getSigner(bigHolderAddress);

      await propose(bigHolder);
    });

    it("cannot propose if proposer owns less tokens than proposal thershold", async () => {
      const smallHolderAddress = "0xd61daebc28274d1feaaf51f11179cd264e4105fb";
      await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [smallHolderAddress],
      });
      const smallHolder = await ethers.getSigner(smallHolderAddress);

      await expect(propose(smallHolder)).to.be.revertedWith(
        "LootDAO::propose: proposer votes below proposal threshold"
      );
    });
  });

  describe("cancel", () => {
    let bigHolder: SignerWithAddress;

    beforeEach(async () => {
      const bigHolderAddress = "0x28b8d4f7516a112e2e2fd462293a1c27cde327a7";
      await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [bigHolderAddress],
      });
      bigHolder = await ethers.getSigner(bigHolderAddress);
    });

    it("cannot cancel proposal if proposer balance is above proposal threshold", async () => {
      await propose(bigHolder);

      await expect(
        bob.sendTransaction({
          to: daoProxy.address,
          data: daoLogic.interface.encodeFunctionData("cancel", [1]),
        })
      ).to.be.revertedWith("LootDAO::cancel: proposer above threshold");
    });

    it("proposal can get cancelled if proposer balance falls below proposal threshold", async () => {
      await propose(bigHolder);

      const tokenIds: BigNumberish[] = [];
      const balance = Number(await loot.balanceOf(bigHolder.address));
      for (let i = 0; i < balance - 1; i++) {
        const tokenId = await loot.tokenOfOwnerByIndex(bigHolder.address, i);
        tokenIds.push(tokenId);
      }

      for (const tokenId of tokenIds) {
        await loot
          .connect(bigHolder)
          .transferFrom(bigHolder.address, alice.address, tokenId);
      }

      await bob.sendTransaction({
        to: daoProxy.address,
        data: daoLogic.interface.encodeFunctionData("cancel", [1]),
      });
    });
  });

  describe("castVote", async () => {
    let bigHolder1: SignerWithAddress;
    let bigHolder2: SignerWithAddress;
    let smallHolder: SignerWithAddress;

    beforeEach(async () => {
      const bigHolder1Address = "0x28b8d4f7516a112e2e2fd462293a1c27cde327a7";
      await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [bigHolder1Address],
      });
      bigHolder1 = await ethers.getSigner(bigHolder1Address);

      const bigHolder2Address = "0xc229d7d3dd662a1b107e29aa84bb0c8ff609cf3a";
      await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [bigHolder2Address],
      });
      bigHolder2 = await ethers.getSigner(bigHolder2Address);

      const smallHolderAddress = "0xd61daebc28274d1feaaf51f11179cd264e4105fb";
      await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [smallHolderAddress],
      });
      smallHolder = await ethers.getSigner(smallHolderAddress);
    });

    it("voter cannot vote with tokens they don't own", async () => {
      await propose(bigHolder1);

      // Advance 1 block to enable voting on the proposal
      await network.provider.send("evm_mine");

      await expect(
        smallHolder.sendTransaction({
          to: daoProxy.address,
          data: daoLogic.interface.encodeFunctionData("castVote", [
            1,
            [357, 1357],
            1,
          ]),
        })
      ).to.be.revertedWith(
        "LootDAO::castVoteInternal: voter not owner of token"
      );
    });

    it("voter cannot vote with the same token on the same proposal more than once", async () => {
      await propose(bigHolder1);

      // Advance 1 block to enable voting on the proposal
      await network.provider.send("evm_mine");

      await smallHolder.sendTransaction({
        to: daoProxy.address,
        data: daoLogic.interface.encodeFunctionData("castVote", [1, [357], 1]),
      });

      await expect(
        smallHolder.sendTransaction({
          to: daoProxy.address,
          data: daoLogic.interface.encodeFunctionData("castVote", [
            1,
            [357],
            1,
          ]),
        })
      ).to.be.revertedWith("LootDAO::castVoteInternal: token already voted");
    });

    it("same token cannot be used to vote on the same proposal more than once", async () => {
      await propose(bigHolder1);

      // Advance 1 block to enable voting on the proposal
      await network.provider.send("evm_mine");

      await smallHolder.sendTransaction({
        to: daoProxy.address,
        data: daoLogic.interface.encodeFunctionData("castVote", [1, [357], 1]),
      });

      await loot
        .connect(smallHolder)
        .transferFrom(smallHolder.address, alice.address, 357);

      await expect(
        alice.sendTransaction({
          to: daoProxy.address,
          data: daoLogic.interface.encodeFunctionData("castVote", [
            1,
            [357],
            1,
          ]),
        })
      ).to.be.revertedWith("LootDAO::castVoteInternal: token already voted");
    });

    it("voter can vote with the same token on different proposals", async () => {
      await propose(bigHolder1);

      // Advance 1 block to enable voting on the proposal
      await network.provider.send("evm_mine");

      await smallHolder.sendTransaction({
        to: daoProxy.address,
        data: daoLogic.interface.encodeFunctionData("castVote", [1, [357], 1]),
      });

      await propose(bigHolder2);

      // Advance 1 block to enable voting on the proposal
      await network.provider.send("evm_mine");

      await smallHolder.sendTransaction({
        to: daoProxy.address,
        data: daoLogic.interface.encodeFunctionData("castVote", [2, [357], 1]),
      });
    });

    it("votes are correctly accounted for", async () => {
      await propose(bigHolder1);

      // Advance 1 block to enable voting on the proposal
      await network.provider.send("evm_mine");

      await bigHolder2.sendTransaction({
        to: daoProxy.address,
        data: daoLogic.interface.encodeFunctionData("castVote", [
          1,
          [2696, 2975],
          1,
        ]),
      });

      await bigHolder2.sendTransaction({
        to: daoProxy.address,
        data: daoLogic.interface.encodeFunctionData("castVote", [
          1,
          [5944, 3207],
          0,
        ]),
      });

      const result = daoLogic.interface.decodeFunctionResult(
        "proposals",
        await ethers.provider.call({
          to: daoProxy.address,
          data: daoLogic.interface.encodeFunctionData("proposals", [1]),
        })
      );
      expect(result.forVotes).to.be.equal(2);
      expect(result.againstVotes).to.be.equal(2);
    });

    it("vote by signature", async () => {
      await propose(bigHolder1);

      // Advance 1 block to enable voting on the proposal
      await network.provider.send("evm_mine");

      const domain = {
        name: "Loot DAO",
        verifyingContract: daoProxy.address,
        chainId: (await ethers.provider.getNetwork()).chainId,
      };

      const types = {
        Ballot: [
          { name: "proposalId", type: "uint256" },
          { name: "tokenIds", type: "uint256[]" },
          { name: "support", type: "uint8" },
        ],
      };

      await loot
        .connect(smallHolder)
        .transferFrom(smallHolder.address, alice.address, 357);

      const signature = await alice._signTypedData(domain, types, {
        proposalId: 1,
        tokenIds: [357],
        support: 1,
      });
      const { v, r, s } = ethers.utils.splitSignature(signature);

      await alice.sendTransaction({
        to: daoProxy.address,
        data: daoLogic.interface.encodeFunctionData("castVoteBySig", [
          1,
          [357],
          1,
          v,
          r,
          s,
        ]),
      });
    });
  });
});
