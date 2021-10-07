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
  FaSword
} from "react-icons/fa";
import { Flex, Box, Grid, Select, Image, Loader, H2, RadioGroup } from "@ui";
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
  const [item, setItem] = useState(null);
  const { floor, bags, loading, fetchMore, moreLeft, total } = useBagData({
    filter,
    item
  });

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage: moreLeft,
    onLoadMore: fetchMore,
    rootMargin: "0px 0px 400px 0px"
  });

  useEffect(() => {
    if (itemsRef && itemsRef.current) {
      const observer = new IntersectionObserver(
        ([e]) => setIsSticky(!e.isIntersecting),
        { threshold: [1] }
      );

      observer.observe(itemsRef.current);
    }
  }, [itemsRef && itemsRef.current]);

  useEffect(() => {
    if (bags && bags.length && isSticky) {
      const stickyElm = document.querySelector("#items");
      window.scrollTo(0, stickyElm.offsetTop - 83);
    }
  }, [bags]);

  return (
    <Flex flex={1} flexDirection="column" bg="background">
      <Header />

      <Box p={3} position="relative">
        <Box
          width={1}
          borderColor="borderColorAlt"
          position="relative"
          borderWidth={2}
          borderRadius="default"
          height={200}
          overflow="auto"
          sx={{
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

        <Box
          position="absolute"
          top={160}
          left="50%"
          sx={{
            transform: "translateX(-50%)"
          }}
        >
          <Flex
            justifyContent="center"
            alignItems="center"
            bg="black"
            borderWidth={2}
            borderColor="borderColorAlt"
            borderRadius="50%"
            width={100}
            height={100}
          >
            <div style={{ fontFamily: "times", fontSize: 30 }}>Loot</div>
          </Flex>
        </Box>
        <Flex mt={2}>
          <IconButton mr={2} icon={<FaDiscord size={20} />} />
          <IconButton mr={2} icon={<FaTwitter size={20} />} />
          <IconButton mr={2} icon={<FaInfo size={20} />} />
        </Flex>
      </Box>

      <Flex flexDirection="column" alignItems="center" mb={4}>
        <H2 mb={3}>Loot Project</H2>

        <CollectionStats floor={floor} total={total} />
      </Flex>
      <Flex
        justifyContent="space-between"
        p={3}
        flexWrap="wrap"
        alignItems="center"
        position="sticky"
        top={-1}
        ref={itemsRef}
        bg="black"
        zIndex={92}
        borderColor={isSticky ? "rgba(255,255,255,0.05)" : "transparent"}
        borderBottomWidth={1}
        sx={{
          transition: "border 300ms ease-in-out"
        }}
      >
        <Flex>
          {false && (
            <Select
              mr={3}
              icon={<FaBars size={14} color="rgba(255,255,255,0.9)" />}
            >
              <option value="all">filters</option>
            </Select>
          )}

          <RadioGroup
            mr={3}
            value={filter}
            onChange={newVal => setFilter(newVal)}
            options={[
              { key: "Loot Exchange", value: "LootExchange" },
              { key: "For Sale", value: "forSale" },
              { key: "All Bags", value: "all" }
            ]}
          />
          <ItemSelector item={item} onChange={newItem => setItem(newItem)} />
        </Flex>
        <Flex>
          <Select
            mr={3}
            display={["none", "none", "block", "block"]}
            onChange={e => setLens(e.target.value)}
            icon={<FaSort color="rgba(255,255,255,0.9)" />}
          >
            <option value="characters">Price</option>
            <option value="loot">Greatness</option>
          </Select>
          <Select
            display={["none", "none", "block", "block"]}
            onChange={e => setLens(e.target.value)}
            icon={<FaEye color="rgba(255,255,255,0.9)" />}
          >
            <option value="characters">Character</option>
            <option value="loot">Loot</option>
          </Select>
        </Flex>
      </Flex>
      <Box p={3} pt={0} minHeight="calc(100vh - 82px)" id="items">
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

      {false && (
        <Box
          position="fixed"
          left="50%"
          bottom={"24px"}
          zIndex={200}
          sx={{
            transition:
              "transform 500ms ease-in-out, opacity 600ms ease-in-out",
            opacity: isSticky ? 1 : 0,
            transform: isSticky
              ? "translate(-50%, 0)"
              : "translate(-50%, 100px)"
          }}
        >
          <CollectionStats
            floor={floor}
            total={total}
            sx={{
              boxShadow: "0px 5px 20px 6px black",
              bg: "#49445c",
              borderRadius: "default"
            }}
          />
        </Box>
      )}
    </Flex>
  );
};

export default Home;
