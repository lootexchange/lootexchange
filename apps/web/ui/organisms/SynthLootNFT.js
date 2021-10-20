import useSynthLoot from "@hooks/useSynthLoot";
import NFT from "@ui/organisms/NFTs/SyntheticLoot";

const SynthLootNFT = ({ address }) => {
  let loot = useSynthLoot(address);

  return loot ? <NFT bag={loot} address={address} /> : null;
};

export default SynthLootNFT;
