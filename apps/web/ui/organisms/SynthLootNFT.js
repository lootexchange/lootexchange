import useSynthLoot from "@hooks/useSynthLoot";
import NFT from "@ui/organisms/LootNFT";

const SynthLootNFT = ({ address }) => {
  let loot = useSynthLoot(address);

  return loot ? (
    <NFT bag={loot} lens="loot" type={"synthLoot"} address={address} />
  ) : null;
};

export default SynthLootNFT;
