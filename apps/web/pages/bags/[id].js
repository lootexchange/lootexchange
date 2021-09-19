import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import useBag from "@hooks/useBag";

import { Flex, Box, Grid, Select, Image, Pane, H2, H3, P, Button } from "@ui";
import Header from "@ui/organisms/Header";
import BackArrow from "@ui/organisms/BackArrow";
import NFT from "@ui/organisms/NFT";
import Owner from "@ui/organisms/Owner";
import ether from "../../public/ether.png";

import { shortenAddress } from "@utils";
import moment from "moment";

const BuyButton = styled(Button)`
  transition: background-color 300ms ease-in-out, color 250ms ease-in-out;

  &:hover {
    background: white;
    color: #7549ff;
  }
`;

const Bag = () => {
  const router = useRouter();
  const { id } = router.query;
  const bag = useBag(id);

  return (
    <Box flex={1} flexDirection="column" bg="background">
      <Header />
      <Box p={3} pt={[1, 1, 1, 3]} maxWidth="large" margin="auto">
        <Flex>
          <BackArrow mb={3} />
        </Flex>
        {bag && (
          <Flex flexWrap="wrap">
            <Box
              maxWidth="medium"
              width={[1, 1 / 2, 1 / 2, 1 / 2]}
              mr={[0, 4, 4]}
              mb={[3, 0, 0]}
            >
              <NFT bag={bag} lens="characters" noData />
            </Box>
            <Pane flex={1} display="flex" flexDirection="column" bg="#161617">
              <Box p={[3, 3, 4]} flex={1}>
                <H2 mb={2}>{bag.name}</H2>
                <Owner
                  mb={4}
                  large
                  name={bag.shortName}
                  address={bag.currentOwner.address}
                  avatar={bag.ownerAvatar}
                />

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
              {bag.isForSale && (
                <Box p={[3, 3, 4]} bg="#7549ff">
                  <H3 color="#ffffffc2" mb={2} fontSize={14}>
                    Current Price
                  </H3>
                  <Flex mb={3}>
                    <Box width={30} height={30} mr={2}>
                      <Image
                        src={ether}
                        width={30}
                        height={30}
                        objectFit="contain"
                      />
                    </Box>
                    <H2 fontSize={24}>{bag.price}</H2>
                  </Flex>
                  <BuyButton bg="#ffffff69" color="white">
                    Buy Now
                  </BuyButton>
                </Box>
              )}
            </Pane>
          </Flex>
        )}

        {bag && bag.transfers && (
          <Box mt={4} mb={5}>
            <H3 fontSize={22} mb={3}>
              Transfers
            </H3>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
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
            </table>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Bag;
