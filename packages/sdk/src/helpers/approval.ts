import { Signer } from "@ethersproject/abstract-signer";
import { BigNumberish } from "@ethersproject/bignumber";
import { Contract } from "@ethersproject/contracts";

import Erc20Abi from "../abis/ERC20.json";
import Erc721Abi from "../abis/ERC721.json";

export default class ApprovalHelper {
  // --------------- Public ---------------

  public static async erc20(
    approver: Signer,
    token: string,
    spender: string,
    amount: BigNumberish
  ) {
    return new Contract(token, Erc20Abi as any)
      .connect(approver)
      .approve(spender, amount);
  }

  public static async erc721(
    approver: Signer,
    token: string,
    to: string,
    tokenId: BigNumberish
  ) {
    return new Contract(token, Erc721Abi as any)
      .connect(approver)
      .approve(to, tokenId);
  }

  public static async erc721All(
    approver: Signer,
    token: string,
    operator: string
  ) {
    return new Contract(token, Erc721Abi as any)
      .connect(approver)
      .setApprovalForAll(operator, true);
  }
}
