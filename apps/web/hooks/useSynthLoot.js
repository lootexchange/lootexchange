import { useState, useEffect } from "react";
import { useContractCalls } from "@usedapp/core";
import { ethers } from "ethers";
const CONTRACT = "0x869Ad3Dfb0F9ACB9094BA85228008981BE6DBddE";

const ABI = [
  {
    inputs: [
      { internalType: "address", name: "walletAddress", type: "address" }
    ],
    name: "chestComponents",
    outputs: [{ internalType: "uint256[5]", name: "", type: "uint256[5]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "walletAddress", type: "address" }
    ],
    name: "footComponents",
    outputs: [{ internalType: "uint256[5]", name: "", type: "uint256[5]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "walletAddress", type: "address" }
    ],
    name: "getChest",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "walletAddress", type: "address" }
    ],
    name: "getFoot",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "walletAddress", type: "address" }
    ],
    name: "getHand",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "walletAddress", type: "address" }
    ],
    name: "getHead",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "walletAddress", type: "address" }
    ],
    name: "getNeck",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "walletAddress", type: "address" }
    ],
    name: "getRing",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "walletAddress", type: "address" }
    ],
    name: "getWaist",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "walletAddress", type: "address" }
    ],
    name: "getWeapon",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "walletAddress", type: "address" }
    ],
    name: "handComponents",
    outputs: [{ internalType: "uint256[5]", name: "", type: "uint256[5]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "walletAddress", type: "address" }
    ],
    name: "headComponents",
    outputs: [{ internalType: "uint256[5]", name: "", type: "uint256[5]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "walletAddress", type: "address" }
    ],
    name: "neckComponents",
    outputs: [{ internalType: "uint256[5]", name: "", type: "uint256[5]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "walletAddress", type: "address" }
    ],
    name: "ringComponents",
    outputs: [{ internalType: "uint256[5]", name: "", type: "uint256[5]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "walletAddress", type: "address" }
    ],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "walletAddress", type: "address" }
    ],
    name: "waistComponents",
    outputs: [{ internalType: "uint256[5]", name: "", type: "uint256[5]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "walletAddress", type: "address" }
    ],
    name: "weaponComponents",
    outputs: [{ internalType: "uint256[5]", name: "", type: "uint256[5]" }],
    stateMutability: "view",
    type: "function"
  }
];
let abi = new ethers.utils.Interface(ABI);
const calls = [
  "tokenURI",
  "getWeapon",
  "getChest",
  "getHead",
  "getWaist",
  "getFoot",
  "getHand",
  "getNeck",
  "getRing"
];

const useSynthLoot = address => {
  const [synthLoot, setSynthLoot] = useState(null);
  const result = useContractCalls(
    calls.map(method => ({
      abi: abi,
      address: CONTRACT, // On-chain address of the deployed contract
      method: method, // Method to be called
      args: address ? [address] : []
    }))
  );

  useEffect(() => {
    const parseResult = async () => {
      let json = await fetch(result[0]).then(res => res.json());
      setSynthLoot({
        id: address,
        ...json,

        attributes: [
          { key: "weapon", value: result[1][0] },
          { key: "chest", value: result[2][0] },
          { key: "head", value: result[3][0] },
          { key: "waist", value: result[4][0] },
          { key: "foot", value: result[5][0] },
          { key: "hand", value: result[6][0] },
          { key: "neck", value: result[7][0] },
          { key: "ring", value: result[8][0] }
        ]
      });
    };

    if (result && result[0]) {
      parseResult();
    }
  }, [result && result[0]]);

  return synthLoot;
};

export default useSynthLoot;
