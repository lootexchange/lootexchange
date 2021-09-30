import { useState, useEffect } from "react";
import Link from "next/link";
import { FaEye, FaFilter, FaArrowDown } from "react-icons/fa";
import { Flex, Box, Grid, Select, Image } from "@ui";
import Header from "@ui/organisms/Header";
import CollectionStats from "@ui/organisms/CollectionStats";
import NFT from "@ui/organisms/NFT";

import useBagData from "../hooks/useBags";
import useInfinteList from "../hooks/useInfiniteList";

const Home = () => {
  const [lens, setLens] = useState("characters");
  const [filteredBags, setFilteredBags] = useState([]);
  const [filter, setFilter] = useState("forSale");
  const [sort, setSort] = useState("price");
  const { floor, bags } = useBagData({ sort, filter });

  const list = useInfinteList(bags, 100);

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
            value={filter}
            onChange={e => setFilter(e.target.value)}
            icon={<FaFilter size={14} color="rgba(255,255,255,0.9)" />}
          >
            <option value="all">All</option>
            <option value="forSale">For Sale</option>
          </Select>

          <Select
            value={sort}
            onChange={e => setSort(e.target.value)}
            ml={3}
            icon={<FaArrowDown size={14} color="rgba(255,255,255,0.9)" />}
          >
            <option value="price">Price</option>
            <option value="number">Number</option>
          </Select>
        </Flex>
        <CollectionStats
          display={["none", "block", "block", "block"]}
          position="absolute"
          top="50%"
          left="50%"
          style={{ transform: "translate(-50%, -50%)" }}
          floor={floor}
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
          {list.map(bag => (
            <Link href={`/bags/${bag.id}`} key={bag.id}>
              <a>
                <NFT bag={bag} lens={lens} />
              </a>
            </Link>
          ))}
        </Grid>
      </Box>
    </Flex>
  );
};

export default Home;
