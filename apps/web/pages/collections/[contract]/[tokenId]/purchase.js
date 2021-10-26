import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import useItem from "@hooks/useItem";
import useCurrentUser from "@hooks/useCurrentUser";
import useContractName from "@hooks/useContractName";
import useCollection from "@hooks/useCollection";
import Tilt from "react-parallax-tilt";
import { Builders, Helpers } from "@lootexchange/sdk";

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
  Hr,
  Logo
} from "@ui";
import Header from "@ui/organisms/Header";
import BackArrow from "@ui/organisms/BackArrow";
import NFT from "@ui/organisms/NFT";
import Owner from "@ui/organisms/Owner";
import ether from "../../../../public/ether.png";
import openSea from "../../../../public/OpenSea-logo.png";
import { FaTimes, FaCheckCircle, FaCube } from "react-icons/fa";
import ReactLoading from "react-loading";
import Link from "next/link";
import eth from "../../../../ethers";

import useExchangeRate from "@hooks/useExchangeRate";

import { shortenAddress, formatMoney, shortenNumber } from "@utils";
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

const CancelButton = styled(Button)`
  background: none;
  color: white;
  transition: background-color 300ms ease-in-out, color 250ms ease-in-out;
  font-size: 16px;

  &:hover {
    background: rgba(255, 255, 255, 0.01);
    color: white;
  }
`;

export const Price = ({ cost, sub }) => (
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

export const ItemCard = ({ bag, price, exchangeRate, collection }) => (
  <Flex>
    <Pane width={100} mr={3} style={{ borderRadius: 0 }}>
      <img
        src={bag.image}
        style={{
          width: "100%"
        }}
      />
    </Pane>
    <Box flex={1}>
      <P my={2} color="#b1b1ff" fontSize={12}>
        {collection && collection.name}
      </P>
      <P>{bag.name}</P>
      <Owner
        mt={3}
        name={bag.shortName}
        address={bag.owner}
        avatar={bag.ownerAvatar}
      />
    </Box>
    {price && <Price cost={price} sub={formatMoney(price * exchangeRate)} />}
  </Flex>
);

const ReviewStep = ({ bag, exchangeRate }) => (
  <>
    <ItemCard bag={bag} price={bag.price} exchangeRate={exchangeRate} />
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
            address={bag.owner}
            avatar={bag.ownerAvatar}
          />
        </Flex>
      </Box>
      {bag.source === "LootExchange" ? (
        <Price cost={shortenNumber(bag.price * 0.99)} sub="99%" />
      ) : (
        <Price cost={shortenNumber(bag.price * 0.975)} sub="97.5%" />
      )}
    </Flex>

    <Flex>
      <Box flex={1}>
        <H3 color="rgba(255,255,255,0.7)">
          {bag.source === "LootExchange" ? "Community Treasury" : "Marketplace"}
        </H3>
        <Flex mt={3} justifyContent="space-between">
          {bag.source === "LootExchange" ? (
            <>
              <Box maxWidth={350} mr={3} flex={1}>
                <P fontSize={14}>
                  Community controlled treasury for funding projects in the
                  lootosphere.
                </P>
                <a
                  href="https://treasury.loot.exchange/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <P mt={1} fontSize={16} color="rgba(100,100,150)">
                    read more
                  </P>
                </a>
              </Box>
            </>
          ) : (
            <Image src={openSea} width={640 / 6.5} height={146 / 6.5} />
          )}
        </Flex>
      </Box>
      {bag.source === "LootExchange" ? (
        <Price cost={shortenNumber(bag.price * 0.01)} sub="1%" />
      ) : (
        <Price cost={shortenNumber(bag.price * 0.025)} sub="2.5%" />
      )}
    </Flex>
  </>
);

const WaitingForConfirmation = ({ bag, exchangeRate }) => {
  let web3Provider = eth.provider.provider;
  let meta = web3Provider.walletMeta || {
    icons: [
      "https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png"
    ],
    name: "MetaMask"
  };
  return (
    <>
      <ItemCard bag={bag} price={bag.price} exchangeRate={exchangeRate} />
      <Hr my={4} mb={5} />
      <H2 mb={5} fontSize={30} textAlign="center" px={4}>
        Confirm the transaction in your wallet
      </H2>
      <Flex justifyContent="center" alignItems="center" flexDirection="column">
        {meta && (
          <>
            <img src={meta.icons[0]} width={150} style={{ borderRadius: 10 }} />
            <P mt={3}>{meta.name}</P>
          </>
        )}
      </Flex>
    </>
  );
};

const WaitingforTransaction = ({ bag, transaction, exchangeRate }) => (
  <>
    <ItemCard bag={bag} price={bag.price} exchangeRate={exchangeRate} />
    <Hr my={4} mb={5} />
    <H2 mb={5} fontSize={30} textAlign="center" px={4}>
      Thank You. Just need to wait for the transaction to go through
    </H2>

    <Flex justifyContent="center" alignItems="center" flexDirection="column">
      <FaCube size={100} />
    </Flex>
  </>
);

const Confirmed = ({ bag, transaction }) => (
  <>
    <ItemCard bag={bag} />
    <Hr my={4} mb={5} />
    <H2 mb={5} fontSize={30} textAlign="center" px={4}>
      Congrats. You got some loot!
    </H2>
    <Flex justifyContent="center" alignItems="center" flexDirection="column">
      <FaCheckCircle size={100} />
    </Flex>
  </>
);

const STEPS = {
  review: "REVIEW",
  watingForConfirmation: "WAITING_FOR_CONFIRMATION",
  waitingforTransaction: "WATING_FOR_TRANSACTION",
  completed: "COMPLETED"
};

const Purchase = () => {
  const { contract, readableName } = useContractName();
  const collection = useCollection(contract);
  const router = useRouter();
  const currentUser = useCurrentUser();
  const [step, setStep] = useState(STEPS.review);
  const { tokenId: id } = router.query;
  let { item: itemData, owner } = useItem(contract, id);
  let bag = { ...itemData, ...owner };

  let exchangeRate = useExchangeRate();
  const login = async () => {
    await eth.logIn();
  };

  let purchase = async () => {
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

      setStep(STEPS.waitingForConfirmation);
      const buyOrder = Builders.Erc721.SingleItem.matchingBuy(
        await eth.signer.getAddress(),
        bag.sellOrder
      );
      Helpers.Wyvern.match(eth.signer, buyOrder, bag.sellOrder)
        .then(async tx => {
          setStep(STEPS.waitingforTransaction);
          let receipt = await tx.wait();
          setStep(STEPS.completed);
          console.log(receipt);
        })
        .catch(() => {
          // TODO: Maybe show an error (although most likely caused by user rejecting)
          setStep(STEPS.review);
        });
    }
  };

  if (step === STEPS.completed) {
    bag = {
      ...bag,
      ownerAvatar: currentUser.avatar,
      shortName: currentUser.name,
      currentOwner: {
        address: currentUser.address
      }
    };
  }

  return (
    <Flex flex={1} bg="background" height="100%" overflow="hidden">
      <Box
        bg="#1e1e1e"
        flex={1}
        height={"100%"}
        display={["none", "none", "block", "block"]}
      >
        <Box p={3} position="absolute" top={0}>
          <Logo width={Math.floor(257 / 2.3)} height={Math.floor(98 / 2.3)} />
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
              address={bag.owner}
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
        p={[3, 3, 4, 4]}
      >
        <Flex justifyContent="space-between" mb={4}>
          <H2 fontSize={16}>Checkout</H2>
          <Link href={`/bags/${bag && bag.id}`}>
            <a>
              <FaTimes />
            </a>
          </Link>
        </Flex>
        <Box flex={1} overflow="auto" pb={4}>
          {bag &&
            collection &&
            {
              [STEPS.review]: (
                <ReviewStep
                  bag={bag}
                  exchangeRate={exchangeRate}
                  collection={collection}
                />
              ),
              [STEPS.waitingForConfirmation]: (
                <WaitingForConfirmation
                  bag={bag}
                  exchangeRate={exchangeRate}
                  collection={collection}
                />
              ),
              [STEPS.waitingforTransaction]: (
                <WaitingforTransaction
                  bag={bag}
                  exchangeRate={exchangeRate}
                  collection={collection}
                />
              ),
              [STEPS.completed]: (
                <Confirmed
                  bag={bag}
                  exchangeRate={exchangeRate}
                  collection={collection}
                />
              )
            }[step]}
        </Box>

        <Hr mb={4} />
        <Flex mb={3}>
          <Box flex={1}>
            <H2 mb={4} fontSize={20}>
              Total
            </H2>
          </Box>
          <Price
            cost={bag ? bag.price : 0}
            sub={bag ? formatMoney(bag.price * exchangeRate) : formatMoney(0)}
          />
        </Flex>
        <Flex mb={3} alignItems="center">
          {false && (
            <Box mr={3}>
              <Checkbox type="checkbox" />
            </Box>
          )}
          {step === STEPS.review && (
            <P fontSize={12}>
              {currentUser
                ? "By clicking this button, I agree to the terms and conditions"
                : "You need to connect your wallet before proceeding"}
            </P>
          )}

          {step === STEPS.waitingForConfirmation && (
            <CancelButton>Cancel</CancelButton>
          )}

          {step === STEPS.waitingforTransaction && (
            <CancelButton>View on Etherscan</CancelButton>
          )}
        </Flex>
        {step === STEPS.completed ? (
          <Link href={`/bags/${bag && bag.id}`}>
            <a>
              <BuyButton>Go to Bag</BuyButton>
            </a>
          </Link>
        ) : currentUser ? (
          <BuyButton onClick={purchase}>
            {step !== STEPS.review ? (
              <Flex justifyContent="center" alignItems="center">
                <ReactLoading
                  type="cylon"
                  color="white"
                  width={55 - 32}
                  height={55 - 32}
                />
              </Flex>
            ) : (
              "Purchase"
            )}
          </BuyButton>
        ) : (
          <BuyButton onClick={login}>Connect wallet</BuyButton>
        )}
      </Flex>
    </Flex>
  );
};

export default Purchase;
