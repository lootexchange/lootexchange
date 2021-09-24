import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import useBag from "@hooks/useBag";
import { FaInfoCircle } from "react-icons/fa";

import { Flex, Box, Grid, Select, Image, Pane, H2, H3, P, Button } from "@ui";
import Link from "next/link";
import Header from "@ui/organisms/Header";
import BackArrow from "@ui/organisms/BackArrow";
import NFT from "@ui/organisms/NFT";
import Owner from "@ui/organisms/Owner";
import ether from "../../public/ether.png";

import { shortenAddress } from "@utils";
import moment from "moment";

const BuyButton = styled(Button)`
  transition: background-color 300ms ease-in-out, color 250ms ease-in-out;
  background: rgb(41 63 215);

  &:hover {
    background: rgb(61 83 235);
    color: white;
  }
`;

const Price = ({ price }) => (
  <>
    <H3 color="#ffffffc2" mb={2} fontSize={14}>
      Current Price
    </H3>
    <Flex mb={3}>
      <Box width={30} height={30} mr={2}>
        <Image src={ether} width={30} height={30} objectFit="contain" />
      </Box>
      <H2 fontSize={24}>{price}</H2>
    </Flex>
  </>
);

const PriceBox = ({ ...props }) => (
  <Box p={[3, 3, 4]} bg="rgb(37 34 47)" {...props} />
);

const Bag = () => {
  const router = useRouter();
  const { id } = router.query;
  const bag = useBag(id);

  const getCallToAction = () => {
    if (!bag.isOwnBag && bag.isForSale) {
      return (
        <PriceBox>
          <Price price={bag.price} />
          <Link href={`/bags/${bag.id}/purchase`} passHref>
            <BuyButton bg="#ffffff69" color="white">
              Buy Now
            </BuyButton>
          </Link>
        </PriceBox>
      );
    }

    if (bag.isOwnBag && bag.isForSale && bag.isOnExchange) {
      return (
        <PriceBox>
          <Price price={bag.price} />
          <Flex>
            <Link href={`/bags/${bag.id}/updatePrice`} passHref>
              <BuyButton bg="#ffffff69" color="white" mr={2}>
                Change Price
              </BuyButton>
            </Link>
            <Link href={`/bags/${bag.id}/cancel`} passHref>
              <BuyButton bg="#ffffff69" color="white" ml={2}>
                Cancel Listing
              </BuyButton>
            </Link>
          </Flex>
        </PriceBox>
      );
    }

    if (bag.isOwnBag && bag.isForSale && !bag.isOnExchange) {
      return (
        <PriceBox>
          <Price price={bag.price} />
          <Link
            href={`/bags/${bag.id}/sell?initialPrice=${bag.price}`}
            passHref
          >
            <BuyButton bg="#ffffff69" color="white" mr={2}>
              Relist on Loot Exchange
            </BuyButton>
          </Link>
          <Flex mt={3}>
            <Box mr={3}>
              <FaInfoCircle />
            </Box>
            <P fontSize={12} lineHeight={1.9} mt={-1}>
              You bag is listed on open sea. If you relist and someone buys your
              bag from Loot exchange, you&apos;ll pay 0% in transaction fees!
            </P>
          </Flex>
        </PriceBox>
      );
    }

    if (bag.isOwnBag && !bag.isForSale) {
      return (
        <PriceBox>
          <Link href={`/bags/${bag.id}/sell`} passHref>
            <BuyButton bg="#ffffff69" color="white" mr={2}>
              Sell
            </BuyButton>
          </Link>
        </PriceBox>
      );
    }

    return false;
  };

  return (
    <Box flex={1} flexDirection="column" bg="background">
      <Header />
      <Box p={3} pt={[1, 1, 1, 3]} maxWidth="large" margin="auto">
        <Flex>
          <BackArrow to="/" mb={3} />
        </Flex>
        {bag && (
          <Flex flexWrap="wrap">
            <Box
              maxWidth="medium"
              width={[1, 1 / 2, 1 / 2, 1 / 2]}
              mr={[0, 4, 4]}
              mb={[3, 0, 0]}
            >
              <NFT
                bag={bag}
                lens="characters"
                noData
                height={["unset", "unset", "100%"]}
              />
            </Box>
            <Pane flex={1} display="flex" flexDirection="column" bg="#161617">
              <Box p={[3, 3, 4]} flex={1}>
                <H2 mb={2}>{bag.name}</H2>
                <Link href={`/adventurers/${bag.owner}`}>
                  <a>
                    <Owner
                      mb={4}
                      large
                      name={bag.shortName}
                      address={bag.owner}
                      avatar={bag.ownerAvatar}
                    />
                  </a>
                </Link>

                {[
                  bag.weapon,
                  bag.chest,
                  bag.head,
                  bag.waist,
                  bag.foot,
                  bag.hand,
                  bag.neck,
                  bag.ring
                ].map(item => (
                  <P key={item} color="white" mb={3} fontSize={16}>
                    {item}
                  </P>
                ))}
              </Box>
              {getCallToAction()}
            </Pane>
          </Flex>
        )}

        {bag && bag.transfers && (
          <Box mt={4} mb={5}>
            <H3 fontSize={22} mb={3}>
              Transfers
            </H3>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr
                  style={{ borderBottom: "2px solid rgba(255, 255, 255, 0.1)" }}
                >
                  <th>
                    <P>From</P>
                  </th>
                  <th>
                    <P>To</P>
                  </th>
                  <th>
                    <P>Date</P>
                  </th>
                </tr>
              </thead>
              <tbody>
                {bag.transfers
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .map(transfer => {
                    return (
                      <tr key={transfer.timestamp}>
                        <td>
                          <P>{shortenAddress(transfer.from.address)}</P>
                        </td>
                        <td>
                          <P>{shortenAddress(transfer.to.address)}</P>
                        </td>
                        <td>
                          <P>{moment.unix(transfer.timestamp).fromNow()}</P>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Bag;
