import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import useBag from "@hooks/useBag";
import useCurrentUser from "@hooks/useCurrentUser";
import Tilt from "react-parallax-tilt";

import {
  Flex,
  Box,
  Image,
  Pane,
  H2,
  H3,
  P,
  Input,
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
import ether from "../../../public/ether.png";
import openSea from "../../../public/OpenSea-logo.png";
import { FaTimes, FaCheckCircle, FaCube } from "react-icons/fa";
import ReactLoading from "react-loading";
import Link from "next/link";
import eth from "../../../ethers";

import useExchangeRate from "@hooks/useExchangeRate";

import { Price, ItemCard } from "./purchase";

import { shortenAddress, formatMoney } from "@utils";
import moment from "moment";
import ListingModal from '@ui/organisms/ListingModal'

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

const ReviewStep = ({ bag, listPrice = "0", setListPrice }) => (
  <>
    <ItemCard bag={bag} />

    <Hr my={4} />
    <P mb={3}>What do you want to list your bag for?</P>
    <Box position="relative">
      <Box position="absolute" left="8px" top={12}>
        <Image src={ether} width={48 / 2} height={48 / 2} />
      </Box>
      <Input
        pl={36}
        value={listPrice}
        onChange={e => setListPrice(e.target.value)}
      />
    </Box>

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
      <Price cost={listPrice} sub="100%" />
    </Flex>

    <Flex>
      <Box flex={1}>
        <H3 color="rgba(255,255,255,0.7)">Marketplace</H3>
        <Flex mt={3} justifyContent="space-between">
          <Logo width={257 / 2.7} height={98 / 2.7} />
        </Flex>
      </Box>
      <Price cost="0" sub="0%" />
    </Flex>
  </>
);

const WaitingForConfirmation = ({ bag }) => {
  let web3Provider = eth.provider.provider;
  let meta = web3Provider.walletMeta || {
    icons: [
      "https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png"
    ],
    name: "MetaMask"
  };
  return (
    <>
      <ItemCard bag={bag} />
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

const WaitingforTransaction = ({ bag, transaction }) => (
  <>
    <ItemCard bag={bag} />
    <Hr my={4} mb={5} />
    <H2 mb={5} fontSize={30} textAlign="center" px={4}>
      Thank You. Just need to wait for the transaction to go through
    </H2>

    <Flex justifyContent="center" alignItems="center" flexDirection="column">
      <FaCube size={100} />
    </Flex>
  </>
);

const Confirmed = ({ bag, transaction, price, exchangeRate }) => (
  <>
    <ItemCard bag={bag} price={price} exchangeRate={exchangeRate} />
    <Hr my={4} mb={5} />
    <H2 mb={5} fontSize={30} textAlign="center" px={4}>
      Congrats. Your bag is listed on Loot Exchange!
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
  const router = useRouter();
  const [listPrice, setListPrice] = useState(0);
  const currentUser = useCurrentUser();
  const [step, setStep] = useState(STEPS.review);
  const { id, initialPrice } = router.query;
  let bag = useBag(id);
  let exchangeRate = useExchangeRate();

  useEffect(() => {
    if (initialPrice) {
      setListPrice(initialPrice);
    }
  }, [initialPrice]);

  const list = () => {
    if (step === STEPS.review) {
      setStep(STEPS.waitingForConfirmation);

      setTimeout(() => {
        setStep(STEPS.waitingforTransaction);

        setTimeout(() => {
          setStep(STEPS.completed);
        }, 3000);
      }, 3000);
    }
  };

  return (
    <Flex flex={1} bg="background" height="100%" overflow="hidden">
      <Box bg="#1e1e1e" flex={1} height={"100%"}>
        <Box p={3} position="absolute" top={0}>
          <Logo width={257 / 2.3} height={98 / 2.3} />
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
          <H2 fontSize={16}>List your bag</H2>
          <Link href={`/bags/${bag && bag.id}`}>
            <a>
              <FaTimes />
            </a>
          </Link>
        </Flex>
        <Box flex={1} overflow="auto" pb={4}>
          {bag &&
            {
              [STEPS.review]: (
                <ReviewStep
                  bag={bag}
                  listPrice={listPrice}
                  setListPrice={setListPrice}
                />
              ),
              [STEPS.waitingForConfirmation]: (
                <WaitingForConfirmation bag={bag} />
              ),
              [STEPS.waitingforTransaction]: (
                <WaitingforTransaction bag={bag} />
              ),
              [STEPS.completed]: <Confirmed bag={bag} />
            }[step]}
        </Box>

        <Hr mb={4} />
        <Flex mb={3}>
          <Box flex={1}>
            <H2 mb={4} fontSize={20}>
              Total
            </H2>
          </Box>
          <Price cost={listPrice} sub={formatMoney(listPrice * exchangeRate)} />
        </Flex>
        <Flex mb={3} alignItems="center">
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
        ) : (
          <BuyButton>
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
            <>
          {!!eth.provider && 
            <ListingModal
                signer={eth.provider.getSigner()}
                collection="0x79e2d470f950f2cf78eef41720e8ff2cf4b3cd78"
                tokenId={id}
                listPrice={listPrice}
              />}
            </>
          )}
        </BuyButton>
        )}
      </Flex>
    </Flex>
  );
};

export default Purchase;
