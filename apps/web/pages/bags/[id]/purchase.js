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
import { FaTimes, FaCheckCircle, FaCube } from "react-icons/fa";
import ReactLoading from "react-loading";
import Link from "next/link";
import eth from "../../../ethers";

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

const ItemCard = ({ bag }) => (
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
);

const ReviewStep = ({ bag }) => (
  <>
    <ItemCard bag={bag} />
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

    <Flex>
      <Box flex={1}>
        <H3 color="rgba(255,255,255,0.7)">Marketplace</H3>
        <Flex mt={3} justifyContent="space-between">
          <Image src={openSea} width={640 / 6.5} height={146 / 6.5} />
        </Flex>
      </Box>
      <Price cost="0.025" sub="2.5%" />
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
  const router = useRouter();
  const currentUser = useCurrentUser();
  const [step, setStep] = useState(STEPS.review);
  const { id } = router.query;
  let bag = useBag(id);

  const purchase = () => {
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
        <Box flex={1} overflow="auto" pb={4}>
          {bag &&
            {
              [STEPS.review]: <ReviewStep bag={bag} />,
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
          <Price cost="1" sub="$3,300" />
        </Flex>
        <Flex mb={3} alignItems="center">
          {false && (
            <Box mr={3}>
              <Checkbox type="checkbox" />
            </Box>
          )}
          {step === STEPS.review && (
            <P fontSize={12}>
              By clicking this button, I agree to the terms and conditions
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
        ) : (
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
        )}
      </Flex>
    </Flex>
  );
};

export default Purchase;
