import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import useItem from "@hooks/useItem";
import useCurrentUser from "@hooks/useCurrentUser";
import useContractName from "@hooks/useContractName";
import useCollection from "@hooks/useCollection";
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
import ether from "../../../../public/ether.png";
import openSea from "../../../../public/OpenSea-logo.png";
import { FaTimes, FaCheckCircle, FaCube } from "react-icons/fa";
import ReactLoading from "react-loading";
import Link from "next/link";
import eth from "../../../../ethers";

import useExchangeRate from "@hooks/useExchangeRate";

import { Price, ItemCard } from "./purchase";

import { shortenAddress, formatMoney, shortenNumber } from "@utils";
import moment from "moment";
import ListingModal from "@ui/organisms/ListingModal";

// need to just make this style the actual button
const BuyButton = styled(Button)`
  color: white;
  transition: background-color 300ms ease-in-out, color 250ms ease-in-out;
  background: rgb(41 63 215);

  &:hover {
    background: rgb(61 83 235);
    color: white;
  }

  ${props =>
    props.disabled &&
    `
    background: gray;
    &:hover {
      background: gray;
    }

    `}
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

const ReviewStep = ({ bag, listPrice = "0", setListPrice, collection }) => (
  <>
    <ItemCard bag={bag} collection={collection} />

    <Hr my={4} />
    <P mb={3}>What do you want to list your bag for?</P>
    <Box position="relative">
      <Box position="absolute" left="8px" top={12}>
        <Image src={ether} width={48 / 2} height={48 / 2} />
      </Box>
      <Input
        pl={36}
        maxlength="15"
        type="number"
        value={listPrice}
        onChange={e => setListPrice(e.target.value.slice(0, 10))}
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
            address={bag.owner}
            avatar={bag.ownerAvatar}
          />
        </Flex>
      </Box>
      <Price
        cost={shortenNumber(listPrice * (1 - collection.royalty))}
        sub={100 - collection.royalty * 100 + "%"}
      />
    </Flex>

    {collection.royalty > 0 && (
      <Flex>
        <Box flex={1}>
          <H3 color="rgba(255,255,255,0.7)">
            {collection.royaltyRecipient.name}
          </H3>
          <Flex mt={3}>
            <Box maxWidth={350} mr={3} flex={1}>
              <P fontSize={14}>{collection.royaltyRecipient.description}</P>
              <a
                href={collection.royaltyRecipient.link}
                target="_blank"
                rel="noreferrer"
              >
                <P mt={1} fontSize={16} color="rgba(100,100,150)">
                  read more
                </P>
              </a>
            </Box>
          </Flex>
        </Box>
        <Price
          cost={shortenNumber(listPrice * collection.royalty)}
          sub={collection.royalty * 100 + "%"}
        />
      </Flex>
    )}
  </>
);

const WaitingForConfirmation = ({ bag, collection }) => {
  let web3Provider = eth.provider.provider;
  let meta = web3Provider.walletMeta || {
    icons: [
      "https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png"
    ],
    name: "MetaMask"
  };
  return (
    <>
      <ItemCard bag={bag} collection={collection} />
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

const WaitingforTransaction = ({ bag, transaction, collection }) => (
  <>
    <ItemCard bag={bag} collection={collection} />
    <Hr my={4} mb={5} />
    <H2 mb={5} fontSize={30} textAlign="center" px={4}>
      Thank You. Just need to wait for the transaction to go through
    </H2>

    <Flex justifyContent="center" alignItems="center" flexDirection="column">
      <FaCube size={100} />
    </Flex>
  </>
);

const Confirmed = ({ bag, transaction, price, exchangeRate, collection }) => (
  <>
    <ItemCard
      bag={bag}
      price={price}
      exchangeRate={exchangeRate}
      collection={collection}
    />
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
  const { contract, collection: c, readableName } = useContractName();
  const collection = useCollection(c);
  const router = useRouter();
  const { tokenId: id, initialPrice } = router.query;
  const { item: itemData, owner } = useItem(contract, id);
  const [listPrice, setListPrice] = useState(0);
  const currentUser = useCurrentUser();
  const [step, setStep] = useState(STEPS.review);
  let exchangeRate = useExchangeRate();

  const bag = { ...itemData, ...owner };

  const login = async () => {
    await eth.logIn();
  };

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
      <Box
        bg="#1e1e1e"
        flex={1}
        height={"100%"}
        display={["none", "none", "block", "block"]}
      >
        <Box p={3} position="absolute" top={0}>
          <Link href="/">
            <a>
              <Logo
                width={Math.floor(257 / 2.3)}
                height={Math.floor(98 / 2.3)}
              />
            </a>
          </Link>
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
              <Box bg="black">
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
          <H2 fontSize={16}>List your bag</H2>

          <Link href={`/collections/${bag.collection}/${bag && bag.id}`}>
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
                  collection={collection}
                  listPrice={listPrice}
                  setListPrice={setListPrice}
                />
              ),
              [STEPS.waitingForConfirmation]: (
                <WaitingForConfirmation bag={bag} collection={collection} />
              ),
              [STEPS.waitingforTransaction]: (
                <WaitingforTransaction bag={bag} collection={collection} />
              ),
              [STEPS.completed]: <Confirmed bag={bag} collection={collection} />
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
        ) : currentUser ? (
          <BuyButton disabled={listPrice <= 0}>
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
                {!!eth.provider && collection && (
                  <ListingModal
                    onComplete={() => setStep(STEPS.completed)}
                    signer={eth.provider.getSigner()}
                    collection={contract}
                    tokenId={id}
                    feeRecipient={collection.royaltyRecipient.address}
                    fee={collection.royalty ? collection.royalty * 10_000 : 0}
                    listPrice={listPrice}
                  />
                )}
              </>
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
