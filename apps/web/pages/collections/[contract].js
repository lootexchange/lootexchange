import { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
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
import NFT from "@ui/organisms/GenericNFT";
import LootNFT from "@ui/organisms/NFTs/Loot";
import FilterBar from "@ui/organisms/FilterBar";

import { useRouter } from "next/router";
import loot from "../../public/community.png";
import useCollection from "@hooks/useCollection";
import useItems from "@hooks/useItems";
import useContractName from "@hooks/useContractName";
import useInfiniteScroll from "react-infinite-scroll-hook";

import useBagData from "@hooks/useBags";

export const IconButton = ({ icon, ...props }) => (
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

export const GenericGrid = styled(Box)`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 24px;

  @media (min-width: 920px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media (min-width: 1520px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  @media (min-width: 2100px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

const Collection = () => {
  const { collection: c, contract, readableName } = useContractName();
  const collection = useCollection(c);

  const [lens, setLens] = useState("characters");
  const [isSticky, setIsSticky] = useState(false);
  const itemsRef = useRef(null);
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState("priceLow");

  const [item, setItem] = useState(null);
  const { floor, items, loading, fetchMore, moreLeft, total } = useItems({
    collection: c,
    sort,
    filter,
    item
  });

  let ItemGrid = collection && collection.loot ? Grid : GenericGrid;
  let Item = collection ? collection.Item || NFT : NFT;

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage: moreLeft,
    onLoadMore: fetchMore,
    rootMargin: "0px 0px 400px 0px"
  });

  useEffect(() => {
    setFilter({});
  }, [c]);

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
    if (isSticky) {
      const stickyElm = document.querySelector("#items");
      window.scrollTo(0, stickyElm.offsetTop - 87);
    }
  }, [filter, sort]);

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
          overflow="hidden"
        >
          {collection && collection.cover ? (
            <img
              src={collection.cover}
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 0,
                left: 0
              }}
            />
          ) : (
            <div />
          )}
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
            overflow="hidden"
            borderRadius="50%"
            width={100}
            height={100}
          >
            {collection ? (
              <img
                style={{
                  objectFit: "cover"
                }}
                src={collection.image}
              />
            ) : (
              <div />
            )}
          </Flex>
        </Box>

        {collection && (
          <Box sx={{ visibility: ["hidden", "unset", "unset", "unset"] }}>
            <Flex mt={2}>
              {collection.discord && (
                <a target="_blank" href={collection.discord} rel="noreferrer">
                  <IconButton mr={2} icon={<FaDiscord size={20} />} />
                </a>
              )}
              {collection.twitter && (
                <a target="_blank" href={collection.twitter} rel="noreferrer">
                  <IconButton mr={2} icon={<FaTwitter size={20} />} />
                </a>
              )}
              {collection.twitter && (
                <a target="_blank" href={collection.home} rel="noreferrer">
                  <IconButton mr={2} icon={<FaHome size={20} />} />
                </a>
              )}
              {collection.etherscan && (
                <a target="_blank" href={collection.etherscan} rel="noreferrer">
                  <IconButton mr={2} icon={<FaEthereum size={20} />} />
                </a>
              )}
            </Flex>
          </Box>
        )}
      </Box>

      <Flex flexDirection="column" alignItems="center" mb={4}>
        <H2 mb={3}>{collection && collection.name}</H2>

        <CollectionStats
          floor={collection ? collection.floor : 0}
          total={collection ? collection.count : 0}
        />
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
          <FilterBar id={c} onChange={setFilter} />
        </Flex>
        <Flex>
          <Select
            mr={3}
            display={["none", "none", "block", "block"]}
            onChange={e => setSort(e.target.value)}
            icon={<FaSort color="rgba(255,255,255,0.9)" />}
          >
            <option value="priceLow">Lowest Price</option>
            <option value="priceHigh">Highest Price</option>
            <option value="tokenId">Token Id</option>
            <option value="greatness">Greatness</option>
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
      <Box p={3} pt={0} mt={1} id="items" minHeight="calc(100vh - 87px)">
        <ItemGrid>
          {collection &&
            items.map(item => (
              <Link
                href={`/collections/${readableName}/${item.id}`}
                key={item.id}
              >
                <a>
                  <Item item={item} />
                </a>
              </Link>
            ))}
        </ItemGrid>

        <Flex py={3} justifyContent="center">
          {loading && <Loader size={50} />}
        </Flex>

        {moreLeft && !loading && (
          <Flex ref={sentryRef} justifyContent="center" />
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

export default Collection;
