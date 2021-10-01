import { useEffect, useState } from "react";
import Link from "next/link";
import { FaEye, FaFilter, FaArrowDown, FaStore } from "react-icons/fa";
import { Flex, Box, Grid, Select, Image, H2, P } from "@ui";
import Header from "@ui/organisms/Header";
import CollectionStats from "@ui/organisms/CollectionStats";
import NFT from "@ui/organisms/NFT";

import { useRouter } from "next/router";
import useBagData from "@hooks/useBags";
import useItem from "@hooks/useItem";
import useInfinteList from "@hooks/useInfiniteList";

const Item = () => {
  const router = useRouter();
  const [lens, setLens] = useState("characters");
  const { id } = router.query;
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("price");
  const item = useItem(id);

  const { bags, localFloor: floor } = useBagData({
    sort,
    filter,
    ids: item && item.ids ? item.ids : []
  });

  const list = useInfinteList(bags, 100);

  return (
    <Flex flex={1} flexDirection="column" bg="background">
      <Header />
      <Box p={3} py={2} pb={1}>
        <P
          fontSize={12}
          mb={"-8px"}
          color="rgba(255,255,255,0.7)"
          sx={{
            textTransform: "capitalize"
          }}
        >
          {item.position}
        </P>
        <H2>{item.label}</H2>
      </Box>
      <Flex
        justifyContent="space-between"
        m={3}
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
            <option value="LootExchange">Loot Exchange</option>
            <option value="OpenSea">Open Sea</option>
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
          count={item.count}
        />
        <Select
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

export default Item;
