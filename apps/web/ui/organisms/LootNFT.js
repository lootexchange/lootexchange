import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { Flex, Box, Pane, P, Image } from "@ui";
import { FaEye, FaList } from "react-icons/fa";
import Source from "@ui/organisms/Source";
import {
  itemRarity,
  rarityColor,
  rarityDescription,
  lootRarity
} from "loot-rarity";
import { sortItems, shortenAddress } from "@utils";

import ether from "../../public/ether.png";
import getGreatness from "../../services/getGreatness";

// gotta clean this up
const NftContainer = styled.div`
  position: relative;
  width: 40%;

  height: 0;
  padding-bottom: 50%;

  @media (min-width: 920px) and (max-width: 1300px) {
    width: 40%;
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

const OpenContainer = styled.div`
  background: black;
  cursor: pointer;
  width: 35px;
  height: 35px;
  position: absolute;
  top: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 10;
  right: 12px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const colors = [
  "#838383",
  "#00DC82",
  "#2e82ff",
  "#c13cff",
  "#f8b73e",
  "#ff44b7"
];

const getColor = greatness => {
  if (greatness < 10) {
    return colors[0];
  }

  if (greatness > 10 && greatness <= 12) {
    return colors[1];
  }

  if (greatness > 12 && greatness <= 15) {
    return colors[2];
  }

  if (greatness > 15 && greatness <= 17) {
    return colors[3];
  }

  if (greatness > 17 && greatness <= 19) {
    return colors[4];
  }

  return colors[5];
};

const Greatness = ({ greatness, item, showRarity }) => (
  <Flex justifyContent="center" alignItems="center">
    {showRarity && (
      <Flex
        display="none"
        mr={2}
        justifyContent="center"
        alignItems="center"
        width={8}
        height={8}
        borderRadius="100%"
        bg={rarityColor(item)}
      />
    )}
    <P fontSize={11} minWidth={15} textAlign="right">
      {greatness}
    </P>
  </Flex>
);

const NFT = ({ bag, lens, noData, type, address, ...props }) => {
  const [viz, setViz] = useState(true);
  const [metaData, setMetaData] = useState(null);
  let image = lens === "loot" ? bag.image : bag.characterImage;

  useEffect(() => {
    const getMetadata = async () => {
      console.log(bag);
      setMetaData(bag.metadata || getGreatness(bag.id));
    };

    getMetadata();
  }, [bag]);

  useEffect(() => {
    setViz(true);
  }, [lens]);

  let items = bag && bag.attributes ? sortItems(bag.attributes) : [];

  return (
    <Pane
      {...props}
      position="relative"
      //style={{ borderWidth: 4, borderColor: "rgba(255,255,255,0.25)" }}
    >
      <Box position="absolute" top={0} right={0} left={0} bottom="0" />
      <Flex position="relative">
        <NftContainer position="relative">
          <Box display={["none", "unset", "unset", "unset"]}>
            {type == "synthLoot" ? (
              <Flex
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                position="absolute"
                top={0}
                bottom={0}
                right={0}
                left={0}
              >
                <Box mb={2}>
                  <img
                    src="/synthLootCollectionLogo.png"
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%"
                    }}
                  />
                </Box>
                <P color="textSecondary">Synth Loot</P>
              </Flex>
            ) : (
              <>
                <img
                  src={image}
                  style={{
                    //padding:
                    // lens == "loot" || (!viz && lens == "characters") ? 10 : 0,
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    inset: 0,
                    objectFit: "cover"
                  }}
                />
                <Box
                  position="absolute"
                  bottom={0}
                  zIndex={10}
                  height="10%"
                  left={0}
                  right={0}
                  bg="black"
                />
              </>
            )}
          </Box>
        </NftContainer>

        <Box
          p={3}
          pt={[5, 3, 3, 3]}
          pb={4}
          flex={1}
          style={{
            borderLeft: "1px solid rgba(255, 255, 255, 0.2)"
          }}
        >
          {items.map(attribute => (
            <Flex
              mb={2}
              justifyContent="space-between"
              alignItems="center"
              key={attribute.key}
            >
              <P flex={1} mr={2} fontSize={[12, 14, 14, 14]}>
                {attribute.value}
              </P>
              <Greatness
                showRarity={type !== "synthLoot"}
                item={attribute.value}
                greatness={metaData ? metaData.greatness[attribute.key] : 0}
              />
            </Flex>
          ))}
        </Box>
        {bag.source && (
          <Box position="absolute" left={12} top={12}>
            <Source size={23} source={bag.source} alignItems="center" />
          </Box>
        )}
      </Flex>
      {!noData && (
        <Box bg="#24222E">
          <Flex justifyContent="space-between" alignItems="center" pr={3}>
            <Flex alignItems="center" flex={1}>
              <img
                src={
                  type === "synthLoot"
                    ? "/synthLootCollectionLogo.png"
                    : "/lootCollectionLogo.png"
                }
                style={{
                  width: 50,
                  height: 50,
                  borderBottomLeftRadius: 10
                }}
              />
              <Box ml={3}>
                <P>
                  {type === "synthLoot"
                    ? "bag " + shortenAddress(address)
                    : bag.name}
                </P>
              </Box>
            </Flex>

            <Box
              py={1}
              px={3}
              border="1px solid rgba(255,255,255,0.2)"
              borderRadius="100px"
            >
              <Greatness
                showRarity={type !== "synthLoot"}
                item={lootRarity(items.map(i => i.value))}
                greatness={metaData ? metaData.scores.greatness : 0}
              />
            </Box>

            <Flex alignItems="center" justifyContent="flex-end" flex={1}>
              {bag.isForSale && (
                <>
                  <Image src={ether} width={18} height={14} />
                  <P color="textPrimary" fontWeight="700" fontSize={16}>
                    {bag.price}
                  </P>
                </>
              )}
            </Flex>
          </Flex>
        </Box>
      )}
    </Pane>
  );
};

export default NFT;
