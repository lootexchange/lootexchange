import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import useBag from "@hooks/useBag";
import { FaInfoCircle, FaTag } from "react-icons/fa";
import { Helpers } from "@lootexchange/sdk";

import { Flex, Box, Grid, Select, Image, Pane, H2, H3, P, Button } from "@ui";
import Link from "next/link";
import Header from "@ui/organisms/Header";
import BackArrow from "@ui/organisms/BackArrow";
import NFT from "@ui/organisms/NFT";
import Source from "@ui/organisms/Source";
import Owner from "@ui/organisms/Owner";
import ether from "../../public/ether.png";
const column = 120;

import getGreatness from "../../services/getGreatness";
import {
  itemRarity,
  rarityColor,
  rarityDescription,
  lootRarity
} from "loot-rarity";
import eth from "../../ethers";

import { shortenAddress } from "@utils";
import moment from "moment";

const BuyButton = styled(Button)`
  transition: background-color 300ms ease-in-out, color 250ms ease-in-out;
  background: rgb(41 63 215);

  &:hover {
    background: rgb(61 83 235);
    color: white;
  }
`;

const Price = ({ price }) => (
  <>
    <H3 color="#ffffffc2" mb={2} fontSize={14}>
      Current Price
    </H3>
    <Flex mb={3}>
      <Box width={30} height={30} mr={2}>
        <Image src={ether} width={30} height={30} objectFit="contain" />
      </Box>
      <H2 fontSize={24}>{price}</H2>
    </Flex>
  </>
);

const PriceBox = ({ ...props }) => (
  <Box p={[3, 3, 4]} pt={[0, 0, 0]} bg="rgb(37 34 47)" {...props} />
);

const attributeDefaults = [
  { key: "Weapon", value: '"Grim Shout" Grave Wand of Skill +1' },
  { key: "Chest", value: "Ancient Helm" },
  { key: "Head", value: "Ancient Helm" },
  { key: "Waist", value: "Hard Leather Belt" },
  { key: "Foot", value: "Ornate Greaves of Anger" },
  { key: "Hand", value: "Gloves" },
  { key: "Neck", value: "Necklace of Enlightenment" },
  { key: "Ring", value: "Gold Ring" }
];

const Bag = () => {
  const router = useRouter();
  const { id } = router.query;
  const [metaData, setMetaData] = useState(null);
  const { bag, owner, transfers } = useBag(id);

  useEffect(() => {
    const getMetadata = async () => {
      console.log(getGreatness(id));
      setMetaData(getGreatness(id));
    };

    if (id) {
      getMetadata();
    }
  }, [id]);

  let attributes =
    bag && bag.attributes.length ? bag.attributes : attributeDefaults;

  const getCallToAction = () => {
    if (!owner.isOwnBag && bag.isForSale) {
      return (
        <PriceBox>
          <Price price={bag.price} />
          <Link href={`/bags/${bag.id}/purchase`} passHref>
            <BuyButton bg="#ffffff69" color="white">
              Buy Now
            </BuyButton>
          </Link>
        </PriceBox>
      );
    }

    if (owner.isOwnBag && bag.isForSale && bag.source === "LootExchange") {
      return (
        <PriceBox>
          <Price price={bag.price} />
          <Flex>
            <Link
              href={`/bags/${bag.id}/sell?initialPrice=${bag.price}`}
              passHref
            >
              <BuyButton bg="#ffffff69" color="white" mr={2}>
                Lower Price
              </BuyButton>
            </Link>
            <BuyButton
              bg="#ffffff69"
              color="white"
              ml={2}
              onClick={async () => {
                if (bag.sellOrder) {
                  if (!eth.signer) {
                    await eth.connect();
                  } else {
                    await Helpers.Wyvern.cancel(eth.signer, bag.sellOrder);
                  }
                }
              }}
            >
              Cancel Listing
            </BuyButton>
          </Flex>
        </PriceBox>
      );
    }

    if (owner.isOwnBag && bag.isForSale && bag.source !== "LootExchange") {
      return (
        <PriceBox>
          <Price price={bag.price} />
          <Link
            href={`/bags/${bag.id}/sell?initialPrice=${bag.price}`}
            passHref
          >
            <BuyButton bg="#ffffff69" color="white" mr={2}>
              Relist on Loot Exchange
            </BuyButton>
          </Link>
          <Flex mt={3}>
            <Box mr={3}>
              <FaInfoCircle />
            </Box>
            <P fontSize={12} lineHeight={1.9} mt={-1}>
              You bag is listed on open sea. If you relist and someone buys your
              bag from Loot exchange, you&apos;ll pay 1% in transaction fees!
            </P>
          </Flex>
        </PriceBox>
      );
    }

    if (owner.isOwnBag && !bag.isForSale) {
      return (
        <PriceBox>
          <Link href={`/bags/${bag.id}/sell`} passHref>
            <BuyButton bg="#ffffff69" color="white" mr={2}>
              Sell
            </BuyButton>
          </Link>
        </PriceBox>
      );
    }

    return false;
  };

  return (
    <Box flex={1} flexDirection="column" bg="background">
      <Header />
      <Box p={3} pt={[1, 1, 1, 3]} maxWidth="large" margin="auto">
        <Flex>
          <BackArrow to="/" mb={3} />
        </Flex>
        {bag && (
          <Flex flexWrap="wrap">
            <Box
              maxWidth="medium"
              width={[1, 1 / 2, 1 / 2, 1 / 2]}
              mb={[3, 0, 0]}
            >
              <Box mr={[0, 4, 4]}>
                <NFT bag={bag} lens="characters" noData />
              </Box>
            </Box>
            <Flex flexDirection="column" width={[1, 1 / 2, 1 / 2, 1 / 2]}>
              <Pane
                mb={4}
                display="flex"
                flexDirection="column"
                bg={
                  bag.isForSale || owner.isOwnBag
                    ? "rgb(37 34 47)"
                    : "rgb(22 22 22)"
                }
              >
                <Box p={[3, 3, 4]} flex={1} position="relative">
                  <Flex justifyContent="space-between">
                    <H2 mb={2}>{bag.name}</H2>
                    {bag.source && (
                      <Source
                        source={bag.source}
                        size={30}
                        alignItem="flex-start"
                      />
                    )}
                  </Flex>

                  <Link href={`/adventurers/${bag.owner}`}>
                    <a>
                      <Owner
                        large
                        name={owner.shortName}
                        address={bag.owner}
                        avatar={owner.ownerAvatar}
                      />
                    </a>
                  </Link>
                </Box>

                {getCallToAction()}
              </Pane>
              <Pane
                flex={1}
                display="flex"
                flexDirection="column"
                bg="rgb(22 22 22)"
              >
                <Box>
                  <Flex p={[3, 3, 4]} alignItems="center">
                    <FaTag size={20} />
                    <H2 ml={3} fontSize={22}>
                      Attributes
                    </H2>
                    <Box flex={1} />
                    <Flex alignItems="center">
                      <P>Rarity</P>

                      <P textAlign="right" width={column}>
                        Greatness
                      </P>
                    </Flex>
                  </Flex>

                  <Flex
                    py={3}
                    px={[3, 3, 4]}
                    alignItems="ceter"
                    borderTop="1px solid rgba(255,255,255,0.1)"
                  >
                    <Box flex={1}>
                      <P
                        fontSize={14}
                        color="rgba(255,255,255, 0.8)"
                        mr={3}
                      ></P>
                      <P color="white" fontSize={16} fontWeight={600}>
                        {bag.name}
                      </P>
                    </Box>
                    <Flex alignItems="center">
                      <P color="rgba(255,255,255,0.9)">
                        {rarityDescription(
                          lootRarity(attributes.map(a => a.value))
                        )}
                      </P>
                      <Box
                        width={12}
                        height={12}
                        borderRadius="50%"
                        ml={2}
                        bg={rarityColor(
                          lootRarity(attributes.map(a => a.value))
                        )}
                      />
                      <P width={column} textAlign="right">
                        {metaData ? metaData.scores.greatness : 0}
                      </P>
                    </Flex>
                  </Flex>
                  {attributes.map(item => (
                    <Flex
                      key={item.value}
                      py={3}
                      px={[3, 3, 4]}
                      alignItems="ceter"
                      borderTop="1px solid rgba(255,255,255,0.1)"
                    >
                      <Box flex={1}>
                        <P fontSize={14} color="rgba(255,255,255, 0.8)" mr={3}>
                          {item.key}
                        </P>
                        <P color="white" fontSize={16} fontWeight={600}>
                          {item.value}
                        </P>
                      </Box>
                      <Flex alignItems="center">
                        <P color="rgba(255,255,255,0.9)">
                          {rarityDescription(itemRarity(item.value))}
                        </P>
                        <Box
                          width={12}
                          height={12}
                          borderRadius="50%"
                          ml={2}
                          bg={rarityColor(item.value)}
                        />
                        <P width={column} textAlign="right">
                          {metaData ? metaData.greatness[item.key] : 0}
                        </P>
                      </Flex>
                    </Flex>
                  ))}
                </Box>
              </Pane>
            </Flex>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default Bag;
