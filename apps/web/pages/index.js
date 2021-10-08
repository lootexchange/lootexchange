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
import {
  P,
  Flex,
  Box,
  Grid,
  Select,
  Image,
  Loader,
  H2,
  RadioGroup,
  H3
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

const Button = props => (
  <Box
    {...props}
    px={3}
    py={3}
    fontSize={18}
    textAlign="center"
    fontFamily="Source Code Pro"
    fontWeight="600"
    borderRadius="default"
    bg="#5C5C5C"
  />
);

const Tag = ({ tag, color, ...props }) => (
  <Box
    py={1}
    px={3}
    bg={color}
    borderRadius="100px"
    fontFamily="times"
    {...props}
  />
);
const Card = ({ title, description, action, image, lootOnly }) => (
  <Flex
    flex={1}
    flexDirection="column"
    borderRadius="default"
    bg="backgroundSecondary"
    overflow="hidden"
    sx={{
      height: 630
    }}
  >
    <Box flex={1}>
      <img
        src={image}
        style={{ height: 220, width: "100%", objectFit: "cover" }}
      />
      <Box p={3} m={1}>
        <H3 fontWeight={400} fontFamily="times">
          {title}
        </H3>
        <P fontWeight={400} color="rgba(255,255,255,0.9)">
          {description}
        </P>
        {lootOnly && (
          <Flex mt={3}>
            <Tag color="#ffffff1f">Loot</Tag>
          </Flex>
        )}
      </Box>
    </Box>

    <Box p={3} m={1}>
      <Flex mb={3}>
        <IconButton mr={2} icon={<FaEthereum />} />
        <IconButton icon={<FaHome />} />
      </Flex>
      <Button>{action}</Button>
    </Box>
  </Flex>
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
          height={450}
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
          px={3}
          alignItems="center"
          position="absolute"
          width={1}
          maxWidth={640}
          top={50}
          left="50%"
          sx={{
            transform: "translateX(-50%)"
          }}
        >
          <div style={{ fontFamily: "times", fontSize: 60 }}>Loot</div>
          <P
            fontSize={20}
            mt={3}
            fontWeight={400}
            color={"rgba(255,255,255,0.8)"}
            textAlign="center"
          >
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

        <Flex maxWidth={1200} mt={4} mb={5}>
          <Flex
            mr={3}
            flexDirection="column"
            borderRadius="default"
            bg="backgroundSecondary"
            sx={{
              width: 300,
              height: 600
            }}
          >
            <Box flex={1}>
              <img src="/mlootheader.svg" />
              <Box p={3} m={1}>
                <H3 fontWeight={400} fontFamily="times">
                  mLoot
                </H3>
                <P fontWeight={400} color="rgba(255,255,255,0.9)">
                  mLoot is more loot. 1.5 million bags with 250,000 more per
                  year. Free to claim
                </P>
              </Box>
            </Box>

            <Box p={3} m={1}>
              <Button>Mint</Button>
            </Box>
          </Flex>

          <Flex
            mr={3}
            borderRadius="default"
            bg="backgroundSecondary"
            flexDirection="column"
            sx={{
              width: 373,
              height: 600
            }}
          >
            <Box flex={1}>
              <img src="/lootheader.svg" />
              <Box p={3} m={1}>
                <H3 fontWeight={400} fontFamily="times" fontSize="40px">
                  Loot
                </H3>
                <P fontWeight={400} color="rgba(255,255,255,0.9)">
                  The original bag of items. Only 8k exist. Are you worthy of
                  such power?
                </P>
              </Box>
            </Box>

            <Box p={3} m={1}>
              <Button mb={3} flex={1}>
                Trade on Loot Exchange
              </Button>
              <Button flex={1}>Trade on Open Sea</Button>
            </Box>
          </Flex>

          <Flex
            mr={3}
            borderRadius="default"
            flexDirection="column"
            bg="backgroundSecondary"
            overflow="hidden"
            sx={{
              width: 300,
              height: 600
            }}
          >
            <Box flex={1}>
              <img src="/syntheticheader.svg" />
              <Box p={3} m={1}>
                <H2 fontWeight={400} fontFamily="times">
                  Synthetic
                </H2>

                <P fontWeight={400} color="rgba(255,255,255,0.9)">
                  Synthetic Loot for anyone with a wallet. Nothing to mint
                  because you already have one!{" "}
                </P>
              </Box>
            </Box>
            <Box p={3} m={1}>
              <Button>View Yours</Button>
            </Box>
          </Flex>
        </Flex>

        <img src="/path.svg" width={400} />

        <Box
          p={3}
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gridGap: 32,

            "@media screen and (max-width: 1200px)": {
              gridTemplateColumns: "1fr 1fr"
            },

            "@media screen and (max-width: 600px)": {
              gridTemplateColumns: "1fr"
            }
          }}
          maxWidth={1200}
          my={5}
        >
          <Card
            title="Adventure Gold"
            description="The Reserve of Gold of the Lootverse"
            image="/agld.png"
            action="Trade on Uniswap"
          />

          <Card
            title="Explore a realm"
            description="Procedurally generated Realms for Adventurers to explore."
            image="https://storage.opensea.io/files/82acfbc09a5d40a390eadcab57841708.svg"
            cost={0.1}
            action="Mint"
          />

          <Card
            title="Distill Mana"
            description="Use your Lootbag and distil the Orders items."
            image="https://pbs.twimg.com/profile_banners/1434342490421694469/1630822895/1500x500"
            lootOnly
            action="Distill"
          />

          <Card
            title="Loot Mart"
            description="Upgrade your warrior by minting your individual items"
            image="https://lootmart.mypinata.cloud/ipfs/QmSqyit6qoK5x4XWN3mv6YjrSp1sPpsqa6T7gMTcWQG32h/589828.png"
            action="Mint"
            lootOnly
          />

          <Card
            title="Loot Character"
            description="Mint your character, join a guild, and solve the riddles"
            image="https://api.lootcharacter.com/imgs/bags/7515.png"
            action="Mint"
            lootOnly
          />
        </Box>
      </Flex>

      <Flex flexDirection="column" alignItems="center" pb={4} bg="#1c1c1c">
        <P mt={5}>CHAPTER 2</P>

        <H2 mt={2}>The Adventure Begins</H2>
        <P mt={3} maxWidth={520} textAlign="center">
          Who carried these Loot bags? Where did they come from? What can you do
          with these treasures? Your adventure begins now.
        </P>

        <Box
          p={3}
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gridGap: 32,

            "@media screen and (max-width: 1200px)": {
              gridTemplateColumns: "1fr 1fr"
            },

            "@media screen and (max-width: 600px)": {
              gridTemplateColumns: "1fr"
            }
          }}
          maxWidth={1200}
          my={5}
        >
          <Card
            title="Upgrade Your Items"
            description="Upgrade those items"
            image="https://lootmart.mypinata.cloud/ipfs/QmSqyit6qoK5x4XWN3mv6YjrSp1sPpsqa6T7gMTcWQG32h/589828.png"
            action="Mint"
            lootOnly
          />

          <Card
            title="The Genesis Project"
            description="Resurect a Genesis Adventurer"
            image="https://pbs.twimg.com/profile_banners/1434342490421694469/1630822895/1500x500"
            lootOnly
            action="Distill"
          />
          <Card
            title="Stake a Realm"
            description="Stake Your Realm"
            image="https://storage.opensea.io/files/82acfbc09a5d40a390eadcab57841708.svg"
            cost={0.1}
            action="Stake"
          />
        </Box>
      </Flex>

      <Flex flexDirection="column" alignItems="center" pb={6} bg="#666670">
        <P mt={5}>CHAPTER 3</P>

        <H2 mt={2}>A Quest for Adventurers</H2>
        <P textStyle="italic">"O Adventurer, look at you…"</P>
        <P
          fontSize={20}
          mt={3}
          maxWidth={720}
          textAlign="center"
          fontWeight={300}
        >
          <P mt={3}>
            How did we let it come to this? Sitting on thrones of aging
            treasure, weaving tales of journeys past and beasts slain.
          </P>
          <P mt={3}>
            A storm is brewing and it intends to swallow us whole. Can you feel
            it in the wind?
          </P>
          <P mt={3}>
            This world needs us once more. Will you join and fight for it? Or
            will you watch from afar, singing past travails and flipping for
            coin?
          </P>
          <P mt={3}>
            From the deepest depths, To the highest peaks, Forgotten friends and
            spoils reaped,
          </P>
        </P>
      </Flex>
      <img src="/footer.png" />
    </Flex>
  );
};

export default Home;
