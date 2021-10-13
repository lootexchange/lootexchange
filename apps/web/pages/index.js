import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import {
  FaEye,
  FaFilter,
  FaArrowDown,
  FaBars,
  FaStore,
  FaInfo,
  FaSort,
  FaTwitter,
  FaDiscord,
  FaEthereum,
  FaHome,
  FaSword
} from "react-icons/fa";
import {
  Flex,
  Box,
  Grid,
  Select,
  P,
  Image,
  Loader,
  H2,
  H1,
  RadioGroup
} from "@ui";
import Header from "@ui/organisms/Header";
import CollectionStats from "@ui/organisms/CollectionStats";
import ItemSelector from "@ui/organisms/ItemSelector";
import NFT from "@ui/organisms/LootNFT";
import loot from "../public/community.png";
import useInfiniteScroll from "react-infinite-scroll-hook";

import useBagData from "../hooks/useBags";

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

  const [item, setItem] = useState(null);
  const { floor, bags, loading, fetchMore, moreLeft, total } = useBagData({});

  return (
    <Flex flex={1} flexDirection="column" bg="background">
      <Header />
      <Flex
        bg="#140F0F"
        p={4}
        py={5}
        flexDirection="column"
        alignItems="center"
      >
        <Box maxWidth={920} width={["100%", "100%", "920px"]}>
          <Flex>
            <img src="/exchangeIcon.svg" width={50} />
            <H1
              ml={4}
              fontFamily="body"
              fontSize={24}
              fontWeight={900}
              maxWidth="640px"
            >
              Buy, Sell, and explore
              <br /> all things Loot
            </H1>
          </Flex>
          <P
            mt={3}
            fontSize={16}
            fontWeight={200}
            color="textSecondary"
            maxWidth="640px"
          >
            0% fee marketplace, 5% to community owned treasury, and window into
            the wild world of loot
          </P>
        </Box>
      </Flex>

      <Flex p={3} alignItems="center" flexDirection="column" pb={6}>
        <H2 my={4} color="textSecondary" fontSize={24}>
          Loot Collections
        </H2>
        <CollectionGrid>
          <Link href="/collections/mloot">
            <a>
              <CollectionCard
                image="/mLootCard.png"
                name={"mLoot"}
                description={`More loot. A Larger supply of loot that can be used to play with`}
              />
            </a>
          </Link>
          <Link href="/loot">
            <a>
              <CollectionCard
                image="/lootbag.png"
                name={"Loot"}
                description={"The OG bag of loot. Has a power of it's own"}
              />
            </a>
          </Link>
          <Link href="/collections/genesis">
            <a>
              <CollectionCard
                image="/genesis.png"
                name={"Genesis"}
                description={"Rare adventures resurected to lead an order"}
              />
            </a>
          </Link>
        </CollectionGrid>
      </Flex>
      <Flex>
        <Grid>
          {bags.map(bag => (
            <Link href={`/bags/${bag.id}`} key={bag.id}>
              <a>
                <NFT bag={bag} lens={lens} />
              </a>
            </Link>
          ))}
        </Grid>
      </Flex>
    </Flex>
  );
};

export default Home;
