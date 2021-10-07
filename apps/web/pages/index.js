import { useState, useEffect, useRef } from "react";
import Link from "next/link";
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
import { P, Flex, Box, Grid, Select, Image, Loader, H2, RadioGroup } from "@ui";
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

const Home = () => {
  const [lens, setLens] = useState("characters");
  const [isSticky, setIsSticky] = useState(false);
  const itemsRef = useRef(null);
  const [filteredBags, setFilteredBags] = useState([]);
  const [filter, setFilter] = useState("forSale");
  const [sort, setSort] = useState("Price");

  const [item, setItem] = useState(null);
  const { floor, bags, loading, fetchMore, moreLeft, total } = useBagData({
    filter,
    sort,
    item
  });

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage: moreLeft,
    onLoadMore: fetchMore,
    rootMargin: "0px 0px 400px 0px"
  });

  return (
    <Flex flex={1} flexDirection="column" bg="background">
      <Header />

      <Box p={0} position="relative">
        <Box
          width={1}
          borderColor="borderColorAlt"
          position="relative"
          //borderWidth={2}
          //borderRadius="default"
          height={400}
          overflow="auto"
          sx={{
            filter: "brightness(0.2)",
            backgroundImage: "url(/public/loot.png)",
            backgroundSize: "cover"
          }}
        >
          <Image
            src={loot}
            layout="fill"
            objectFit="cover"
            objectPosition="top"
          />
        </Box>

        <Flex
          flexDirection="column"
          alignItems="center"
          position="absolute"
          top={50}
          left="50%"
          sx={{
            transform: "translateX(-50%)"
          }}
        >
          <div style={{ fontFamily: "times", fontSize: 60 }}>Loot</div>
          <P fontSize={20} mt={3} fontWeight={300} textAlign="center">
            Loot is randomized adventurer gear generated and stored on chain.
            Stats, images, and other functionality are intentionally omitted for
            others to interpret. Feel free to use Loot in any way you want.
          </P>

          <Box sx={{ visibility: ["hidden", "hidden", "unset", "unset"] }}>
            <Flex mt={4}>
              <a
                target="_blank"
                href="https://discord.com/invite/NXEntTSHgy"
                rel="noreferrer"
              >
                <IconButton mr={2} icon={<FaDiscord size={20} />} />
              </a>
              <a
                target="_blank"
                href="https://twitter.com/lootproject"
                rel="noreferrer"
              >
                <IconButton mr={2} icon={<FaTwitter size={20} />} />
              </a>
              <a
                target="_blank"
                href="https://etherscan.io/address/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7#code"
                rel="noreferrer"
              >
                <IconButton mr={2} icon={<FaEthereum size={20} />} />
              </a>
            </Flex>
          </Box>
        </Flex>
      </Box>

      <Flex flexDirection="column" alignItems="center" mb={4}>
        <P mt={5}>CHAPTER 1</P>

        <H2 mt={2}>Start the Quest</H2>
        <P mt={3} maxWidth={520} textAlign="center">
          You have the heart and the determination. All you need now is the
          right gear
        </P>

        <Flex maxWidth={1200} mt={4}>
          <Box
            mr={3}
            bg="backgroundSecondary"
            sx={{
              transform: "skew(-10deg)",
              width: 200,
              height: 400
            }}
          />

          <Box position="relative">
            <Box position="absolute" top={0} bottom={0} right={0} left={0}>
              <H2>Loot (for Adventurers)</H2>
            </Box>
            <Box
              mr={3}
              bg="backgroundSecondary"
              sx={{
                transform: "skew(-10deg)",
                width: 400,
                height: 400
              }}
            ></Box>
          </Box>

          <Box
            bg="backgroundSecondary"
            sx={{
              transform: "skew(-10deg)",
              width: 200,
              height: 400
            }}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Home;
