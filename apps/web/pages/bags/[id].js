import styled from "@emotion/styled";
import useBag from "@hooks/useBag";
import { Builders, Helpers } from "@lootexchange/sdk";
import moment from "moment";
import { useRouter } from "next/router";

import { Flex, Box, Image, Pane, H2, H3, P, Button } from "@ui";
import BackArrow from "@ui/organisms/BackArrow";
import Header from "@ui/organisms/Header";
import NFT from "@ui/organisms/NFT";
import Owner from "@ui/organisms/Owner";

import eth from "@ethers";
import { shortenAddress } from "@utils";

import ether from "../../public/ether.png";

const BuyButton = styled(Button)`
  transition: background-color 300ms ease-in-out, color 250ms ease-in-out;
  background: rgb(41 63 215);

  &:hover {
    background: rgb(61 83 235);
    color: white;
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
                  bag.ring,
                ].map((item) => (
                  <P key={item} color="white" mb={3} fontSize={16}>
                    {item}
                  </P>
                ))}
              </Box>
              {bag.isForSale && (
                <Box p={[3, 3, 4]} bg="rgb(37 34 47)">
                  <H3 color="#ffffffc2" mb={2} fontSize={14}>
                    Current Price
                  </H3>
                  <Flex mb={3}>
                    <Box width={30} height={30} mr={2}>
                      <Image
                        alt="ETH"
                        src={ether}
                        width={30}
                        height={30}
                        objectFit="contain"
                      />
                    </Box>
                    <H2 fontSize={24}>{bag.price}</H2>
                  </Flex>
                  <BuyButton
                    bg="#ffffff69"
                    color="white"
                    onClick={async () => {
                      if (!eth.signer) {
                        await eth.connect();
                      } else {
                        // No need to check approvals as the tx would fail
                        // if the correct sell approval is missing. What's
                        // needed is error handling in case the transaction
                        // fails. The tx could fail for several reasons, but
                        // a common failure scenario is insuffient funds,
                        // which fortunately can be trakced down in a similar
                        // way as described below
                        // https://twitter.com/smpalladino/status/1436350919243862016?s=20

                        const buyOrder = Builders.Erc721.SingleItem.matchingBuy(
                          await eth.signer.getAddress(),
                          bag.sellOrder
                        );
                        await Helpers.Wyvern.match(
                          eth.signer,
                          buyOrder,
                          bag.sellOrder
                        );
                      }
                    }}
                  >
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
                  .map((transfer) => {
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
