import { useEffect, useState } from "react";
import { Flex, Box, P, Grid, Select } from "@ui";
import Link from "next/link";
import { useRouter } from "next/router";
import NFT from "@ui/organisms/NFTs/Loot";
import Owner from "@ui/organisms/Owner";
import Header from "@ui/organisms/Header";
import SynthLootNFT from "@ui/organisms/SynthLootNFT";

import GenesisItem from "@ui/organisms/NFTs/Genesis";
import MLootItem from "@ui/organisms/NFTs/mLoot";
import LootItem from "@ui/organisms/NFTs/Loot";
import GenericNFT from "@ui/organisms/GenericNFT";
import { GenericGrid } from "../collections/[contract]";

import { FaEye } from "react-icons/fa";

import useWallet from "@hooks/useWallet";
import useAddressTokens from "@hooks/useAddressTokens";

const itemMap = {
  genesisadventurer: GenesisItem,
  "more-loot": MLootItem,
  loot: LootItem
};

const Adventurer = ({}) => {
  const router = useRouter();
  const { address } = router.query;

  const [lens, setLens] = useState("characters");

  const tokens = useAddressTokens(address);

  const wallet = useWallet(address);
  const bagsHeld = tokens.length + 1;

  return (
    <Flex flex={1} flexDirection="column" bg="black">
      <Header />
      <Flex justifyContent="space-between" p={3} pb={2}>
        <Box mb={3}>
          <Owner address={address || ""} name={wallet.shortName || ""} large />
        </Box>
        <Box>
          <Select
            onChange={e => setLens(e.target.value)}
            icon={<FaEye color="rgba(255,255,255,0.9)" />}
          >
            <option value="characters">Character</option>
            <option disabled value="hyper">
              Hyperloot
            </option>

            <option disabled value="swag">
              Loot Swag
            </option>
          </Select>
        </Box>
      </Flex>
      <Box p={3} pt={0}>
        <Grid>
          {address && <SynthLootNFT address={address} />}
          {tokens
            .filter(token => !!itemMap[token.collection])
            .map(loot => {
              let Item = itemMap[loot.collection] || GenericNFT;

              return (
                <Link
                  key={loot.collection + loot.tokenId}
                  href={`/collections/${loot.collection}/${loot.tokenId}`}
                  style={{ textDecoration: "none" }}
                >
                  <a>
                    <Item item={loot} />
                  </a>
                </Link>
              );
            })}
        </Grid>

        <GenericGrid style={{ marginTop: 24 }}>
          {false &&
            tokens
              .filter(token => !itemMap[token.collection])
              .map(loot => {
                let Item = itemMap[loot.collection] || GenericNFT;

                return (
                  <Link
                    key={loot.tokenId}
                    href={`/collections/loot/${loot.tokenId}`}
                    style={{ textDecoration: "none" }}
                  >
                    <a>
                      <Item item={loot} />
                    </a>
                  </Link>
                );
              })}
        </GenericGrid>
      </Box>
    </Flex>
  );
};

export default Adventurer;
