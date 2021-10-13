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
            overflow="hidden"
            width={100}
            height={100}
          >
            <img
              style={{
                objectFit: "cover"
              }}
              src="/lootCollectionLogo.png"
            />
          </Flex>
        </Box>
        <Box sx={{ visibility: ["hidden", "unset", "unset", "unset"] }}>
          <Flex mt={2}>
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
            <a target="_blank" href="https://lootproject.com" rel="noreferrer">
              <IconButton mr={2} icon={<FaHome size={20} />} />
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
      </Box>

      <Flex flexDirection="column" alignItems="center" mb={4}>
        <H2 mb={3}>Loot</H2>

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
          <ItemSelector
            item={item}
            onChange={newItem => setItem(newItem)}
            display={["none", "block", "block", "block"]}
          />
        </Flex>
        <Flex>
          <Select
            mr={3}
            display={["none", "none", "block", "block"]}
            onChange={e => setSort(e.target.value)}
            icon={<FaSort color="rgba(255,255,255,0.9)" />}
          >
            <option value="Price">Price</option>
            <option value="Greatness">Greatness</option>
          </Select>
          <Select
            display={["none", "none", "block", "block"]}
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
