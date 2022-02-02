import {
  Box,
  Flex,
  Grid,
  H1,
  H2,
  Image,
  Loader,
  P,
  Pane,
  RadioGroup,
  Select
} from "@ui";
import {
  FaArrowDown,
  FaBars,
  FaDiscord,
  FaEthereum,
  FaEye,
  FaFilter,
  FaHome,
  FaInfo,
  FaSort,
  FaStore,
  FaSword,
  FaTwitter
} from "react-icons/fa";
import { formatMoney, shortenNumber } from "@utils";
import { useEffect, useRef, useState } from "react";

import CollectionStats from "@ui/organisms/CollectionStats";
import Header from "@ui/organisms/Header";
import ItemSelector from "@ui/organisms/ItemSelector";
import Link from "next/link";
import NFT from "@ui/organisms/NFTs/Loot";
import { formatEther } from "@ethersproject/units";
import loot from "../public/community.png";
import { nameToContractMap } from "@hooks/useContractName";
import styled from "@emotion/styled";
import useCollection from "@hooks/useCollection";
import { useEtherBalance } from "@usedapp/core";
import useExchangeRate from "@hooks/useExchangeRate";
import useInfiniteScroll from "react-infinite-scroll-hook";
import useItems from "../hooks/useItems";

const IconButton = ({ icon, ...props }) => (
  <Box
    p={3}
    borderRadius="default"
    borderColor="borderColorAlt"
    borderWidth={1}
    {...props}
  >
    {icon}
  </Box>
);

const CollectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 24px;
  max-width: 920px;
  width: 100%;

  @media (max-width: 620px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  max-width: 920px;
  width: 100%;

  @media (max-width: 832px) {
    grid-template-columns: 1fr 1fr;
  }

  & > div {
    border-radius: 0px;
    border-right-width: 0px;
  }

  & > div:first-child {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  & > div:last-child {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    border-right-width: 2px;
  }
`;

const CollectionCard = ({ image, name, description }) => (
  <Flex
    height={"100%"}
    flexDirection="column"
    sx={{
      cursor: "pointer"
    }}
  >
    <Box height={0} paddingBottom="100%" w={1} position="relative">
      <Box position="absolute" top={0} bottom={0} left={0} right={0}>
        <img
          src={image}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            objectFit: "cover"
          }}
        />
      </Box>
    </Box>
    <Box bg="#1F3744" p={3} flex={1}>
      <H2 fontSize={24} m={0}>
        {name}
      </H2>
      <P mt={1} color="textSecondary">
        {description}
      </P>
    </Box>
  </Flex>
);

const Home = () => {
  const [lens, setLens] = useState("characters");
  const [isSticky, setIsSticky] = useState(false);
  const itemsRef = useRef(null);
  const exchangeRate = useExchangeRate();
  const treasury = useEtherBalance(
    "0x8cFDF9E9f7EA8c0871025318407A6f1Fbc5d5a18"
  );

  const [item, setItem] = useState(null);
  const { items, loading, fetchMore, moreLeft } = useItems({
    collection: nameToContractMap.loot.collection
  });
  const collection = useCollection(nameToContractMap.loot.collection);

  return (
    <Flex flex={1} flexDirection="column" bg="background">
      <Header />
      <Box position="relative">
        <Flex
          //bg="#140F0F"
          bg="#1e2b4d"
          p={4}
          pt={[4, 5]}
          pb={"100px"}
          flexDirection="column"
          alignItems="center"
        >
          <Box maxWidth={920} width={["100%", "100%", "100%", "920px"]}>
            <Flex>
              <img src="/exchangeIcon.svg" width={50} />
              <H1
                ml={4}
                fontFamily="body"
                fontSize={[16, 24]}
                fontWeight={900}
                maxWidth="640px"
              >
                Buy, sell, and explore
                <br /> all things Loot
              </H1>
            </Flex>
            <P
              mt={3}
              fontSize={[14, 16]}
              fontWeight={200}
              color="textSecondary"
              maxWidth="640px"
            >
              A Loot community marketplace with 0% marketplace fees and
              community royalties. The adventure awaits.
            </P>
          </Box>
        </Flex>{" "}
        <Flex
          p={3}
          alignItems="center"
          flexDirection="column"
          pb={5}
          position="absolute"
          left={0}
          right={0}
          top="calc(100% - 80px)"
        >
          <StatGrid>
            <Pane bg="black">
              <a href="https://www.royaltydao.com/">
                <Box p={3}>
                  <P mb={1} color="textSecondary">
                    Treasury
                  </P>
                  <H2>
                    Ξ
                    {treasury
                      ? shortenNumber(Number(formatEther(treasury || 0)))
                      : 0}
                  </H2>
                  <P mt={-1} color="textSecondary">
                    {treasury
                      ? formatMoney(formatEther(treasury) * exchangeRate)
                      : 0}
                  </P>
                </Box>
              </a>
            </Pane>
            <Pane bg="black" display={["none", "none", "block", "block"]}>
              <a href="https://www.royaltydao.com/">
                <Box p={3}>
                  <P mb={1} color="textSecondary">
                    Open Proposals
                  </P>
                  <H2>0</H2>
                  <P mt={-1} color="textSecondary">
                    0 closed
                  </P>
                </Box>
              </a>
            </Pane>
            <Pane bg="black">
              <Link href="/collections/loot">
                <a>
                  <Box p={3}>
                    <P mb={1} color="textSecondary">
                      Loot Floor
                    </P>
                    <H2>
                      Ξ{collection ? shortenNumber(collection.floor || 0) : 0}
                    </H2>
                    <P mt={-1} color="textSecondary">
                      {collection
                        ? formatMoney(collection.floor * exchangeRate)
                        : 0}
                    </P>
                  </Box>
                </a>
              </Link>
            </Pane>
          </StatGrid>
        </Flex>
      </Box>
      <Flex
        p={3}
        alignItems="center"
        flexDirection="column"
        pb={5}
        pt={"100px"}
      >
        <H2 my={4} color="textSecondary" fontSize={24}>
          Loot Collections
        </H2>
        <CollectionGrid>
          <Link href="/collections/more-loot">
            <a>
              <CollectionCard
                image="/mLootCard.png"
                name={"mLoot"}
                description={`More Adventurers to start your journey.`}
              />
            </a>
          </Link>
          <Link href="/collections/loot">
            <a>
              <CollectionCard
                image="/lootbag.png"
                name={"Loot"}
                description={
                  "The original Adventurers. Only 8,000 exist. Are you worthy of such power?"
                }
              />
            </a>
          </Link>
          <Link href="/collections/genesisadventurer">
            <a>
              <CollectionCard
                image="/genesis.png"
                name={"Genesis"}
                description={
                  "The 2,540 champions of the loot ancestral orders."
                }
              />
            </a>
          </Link>
        </CollectionGrid>
      </Flex>
      <Box p={[3, 4]} alignItems="center" flexDirection="column">
        <H2 mb={3} color="textSecondary" fontSize={24}>
          Entry Bags
        </H2>

        <Grid>
          {items.slice(0, 6).map(bag => (
            <Link href={`/collections/loot/${bag.id}`} key={bag.id}>
              <a>
                <NFT item={bag} />
              </a>
            </Link>
          ))}
        </Grid>
        <Link href="/collections/loot">
          <a>
            <P mt={3}>See All</P>
          </a>
        </Link>
      </Box>
    </Flex>
  );
};

export default Home;
