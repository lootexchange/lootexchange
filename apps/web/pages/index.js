import { useState, useEffect } from "react";
import Link from "next/link";
import { FaEye, FaFilter, FaArrowDown, FaStore } from "react-icons/fa";
import { Flex, Box, Grid, Select, Image, Loader } from "@ui";
import Header from "@ui/organisms/Header";
import CollectionStats from "@ui/organisms/CollectionStats";
import ItemSelector from "@ui/organisms/ItemSelector";
import NFT from "@ui/organisms/NFT";
import useInfiniteScroll from "react-infinite-scroll-hook";

import useBagData from "../hooks/useBags";

const Home = () => {
  const [lens, setLens] = useState("characters");
  const [filteredBags, setFilteredBags] = useState([]);
  const [filter, setFilter] = useState("forSale");
  const { floor, bags, loading, fetchMore, moreLeft, total } = useBagData({
    filter
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
      <Flex
        justifyContent="space-between"
        m={3}
        flexWrap="wrap"
        mt={2}
        alignItems="center"
        position="relative"
      >
        <Flex>
          <Select
            mr={3}
            value={filter}
            onChange={e => setFilter(e.target.value)}
            icon={<FaFilter size={14} color="rgba(255,255,255,0.9)" />}
          >
            <option value="all">All</option>
            <option value="forSale">For Sale</option>
            <option value="LootExchange">Loot Exchange</option>
            <option value="OpenSea">Open Sea</option>
          </Select>
          {false && <ItemSelector />}
        </Flex>
        <CollectionStats
          display={["none", "block", "block", "block"]}
          position="absolute"
          top="50%"
          left="50%"
          style={{ transform: "translate(-50%, -50%)" }}
          floor={floor}
          total={total}
        />
        <Select
          display={["none", "none", "block", "block"]}
          onChange={e => setLens(e.target.value)}
          icon={<FaEye color="rgba(255,255,255,0.9)" />}
        >
          <option value="characters">Character</option>
          <option value="loot">Loot</option>
        </Select>
      </Flex>
      <Box p={3} pt={0}>
        <Grid>
          {bags.map(bag => (
            <Link href={`/bags/${bag.id}`} key={bag.id}>
              <a>
                <NFT bag={bag} lens={lens} />
              </a>
            </Link>
          ))}
        </Grid>
        {(loading || moreLeft) && (
          <Flex ref={sentryRef} py={3} justifyContent="center">
            <Loader size={50} />
          </Flex>
        )}
      </Box>
    </Flex>
  );
};

export default Home;
