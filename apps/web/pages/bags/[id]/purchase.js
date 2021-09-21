import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import useBag from "@hooks/useBag";
import Tilt from "react-parallax-tilt";

import {
  Flex,
  Box,
  Image,
  Pane,
  H2,
  H3,
  P,
  Checkbox,
  Button,
  H1,
  Hr
} from "@ui";
import Header from "@ui/organisms/Header";
import BackArrow from "@ui/organisms/BackArrow";
import NFT from "@ui/organisms/NFT";
import Owner from "@ui/organisms/Owner";
import ether from "../../../public/ether.png";
import openSea from "../../../public/OpenSea-logo.png";
import { FaTimes } from "react-icons/fa";
import Link from "next/link";

import { shortenAddress } from "@utils";
import moment from "moment";

// need to just make this style the actual button
const BuyButton = styled(Button)`
  color: white;
  transition: background-color 300ms ease-in-out, color 250ms ease-in-out;
  background: rgb(41 63 215);

  &:hover {
    background: rgb(61 83 235);
    color: white;
  }
`;

const Price = ({ cost, sub }) => (
  <Flex flexDirection="column" justifyContent="flexEnd" alignItems="flex-end">
    <Box>
      <Flex>
        <Image src={ether} width={48 / 2} height={48 / 2} />
        <P ml={1} fontSize={20}>
          {cost}
        </P>
      </Flex>
    </Box>
    <P fontSize={14} color="rgba(255,255,255,0.8)" mt={2}>
      ({sub})
    </P>
  </Flex>
);

const Purchase = () => {
  const router = useRouter();
  const { id } = router.query;
  const bag = useBag(id);

  return (
    <Flex flex={1} bg="background" height="100%" overflow="hidden">
      <Box bg="#1e1e1e" flex={1} height={"100%"}>
        <Box p={3} position="absolute" top={0}>
          <H1 style={{ fontSize: 24 }}>Loot</H1>
        </Box>
        {bag && (
          <Flex
            justifyContent="center"
            alignItems="center"
            height={"100%"}
            flexDirection="column"
            p={3}
          >
            <H2 mb={3}>{bag.name}</H2>
            <Tilt
              perspective={500}
              glareEnable={true}
              glareMaxOpacity={0.35}
              scale={1.02}
            >
              <Box bg="black" p={10}>
                <img
                  src={bag.image}
                  style={{
                    width: 450,
                    background: "black",
                    display: "block"
                  }}
                />
              </Box>
            </Tilt>
            <Owner
              mt={4}
              large
              name={bag.shortName}
              address={bag.currentOwner.address}
              avatar={bag.ownerAvatar}
            />
          </Flex>
        )}
      </Box>
      <Flex
        flexDirection="column"
        bg="background"
        width={1}
        maxWidth={600}
        height={"100%"}
        p={4}
      >
        <Flex justifyContent="space-between" mb={4}>
          <H2 fontSize={16}>Checkout</H2>
          <Link href={`/bags/${bag && bag.id}`}>
            <a>
              <FaTimes />
            </a>
          </Link>
        </Flex>
        <Box flex={1}>
          {bag && (
            <>
              <Flex>
                <Pane width={100} mr={3}>
                  <img
                    src={bag.image}
                    style={{
                      width: "100%",
                      padding: 10
                    }}
                  />
                </Pane>
                <Box flex={1}>
                  <P my={2} color="#b1b1ff" fontSize={12}>
                    Loot (for Adventurers)
                  </P>
                  <P>{bag.name}</P>
                  <Owner
                    mt={3}
                    name={bag.shortName}
                    address={bag.currentOwner.address}
                    avatar={bag.ownerAvatar}
                  />
                </Box>
                <Price cost={1.0} sub={"$3,300"} />
              </Flex>
              <Hr my={4} />

              <H2 mb={4} fontSize={16}>
                Distribution
              </H2>
              <Flex mb={4}>
                <Box flex={1}>
                  <H3 color="rgba(255,255,255,0.7)">Seller</H3>
                  <Flex mt={3} justifyContent="space-between">
                    <Owner
                      name={bag.shortName}
                      address={bag.currentOwner.address}
                      avatar={bag.ownerAvatar}
                    />
                  </Flex>
                </Box>
                <Price cost="0.975" sub="98%" />
              </Flex>

              <Flex mb={4}>
                <Box flex={1}>
                  <H3 color="rgba(255,255,255,0.7)">Marketplace</H3>
                  <Flex mt={3} justifyContent="space-between">
                    <Image src={openSea} width={640 / 6.5} height={146 / 6.5} />
                  </Flex>
                </Box>
                <Price cost="0.025" sub="2.5%" />
              </Flex>
            </>
          )}
        </Box>

        <Hr my={4} />
        <Flex mb={4}>
          <Box flex={1}>
            <H2 mb={4} fontSize={20}>
              Total
            </H2>
          </Box>
          <Price cost="1" sub="$3,300" />
        </Flex>
        <Flex mb={4} alignItems="center">
          <Box mr={3}>
            <Checkbox type="checkbox" />
          </Box>
          <P>I agree to the terms and conditions</P>
        </Flex>
        <BuyButton>Purchase</BuyButton>
      </Flex>
    </Flex>
  );
};

export default Purchase;
