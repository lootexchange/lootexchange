import { Box, Flex, Avatar, Pane, P, Image } from "@ui";
import styled from "@emotion/styled";
import useCurrentUser from "@hooks/useCurrentUser";
import { Popover } from "@headlessui/react";
import { getChainName, formatEth } from "@utils";

import { useRecoilState } from "recoil";
import { currentUser as currentUserAtom } from "../../../atoms";

import ethers from "../../../ethers";
import ether from "../../../public/ether.png";

const ButtonWrapper = styled(Popover.Button)`
  color: white;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
`;

const AccountContainer = ({ ...props }) => (
  <Box
    bg="backgroundSecondary"
    py="12px"
    pl="24px"
    pr="52px"
    borderRadius="50px"
    maxWidth="240px"
    overflow="hidden"
    fontFamily="body"
    fontWeight={600}
    sx={{
      textOverflow: "ellipsis",
      cursor: "pointer"
    }}
    {...props}
  />
);

const Account = () => {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);

  const loginWithWalletConnect = async () => {
    await ethers.logIn();
  };

  const logOut = async () => {
    await ethers.logOut();
    setCurrentUser(null);
  };

  if (!currentUser) {
    return (
      <AccountContainer
        onClick={loginWithWalletConnect}
        style={{ paddingRight: 24 }}
      >
        Connect Wallet
      </AccountContainer>
    );
  }

  return (
    <Popover style={{ position: "relative" }}>
      <ButtonWrapper>
        <AccountContainer>{currentUser.name}</AccountContainer>
        <Avatar
          size={30}
          avatar={currentUser.avatar}
          address={currentUser.address}
          position="absolute"
          right="8px"
          top="50%"
          sx={{
            transform: "translate(0, -50%)"
          }}
        />
      </ButtonWrapper>
      <Popover.Panel style={{ position: "absolute", right: 0, zIndex: 100 }}>
        <Pane
          bg="#0d0d0d"
          style={{
            boxShadow: "0px 5px 20px 6px black",
            border: "1px solid rgba(255, 255, 255, 0.2)"
          }}
          mt={2}
          width={420}
        >
          <Box p={3}>
            <Flex>
              <Avatar
                size={40}
                style={{ border: "1px solid rgba(255,255,255,0.2)" }}
                avatar={currentUser.avatar}
                address={currentUser.address}
              />
              <Box ml={3}>
                <P fontWeight={700}>{currentUser.name}</P>

                <P mt={1} fontSize={12}>
                  {currentUser.address}
                </P>
              </Box>
            </Flex>
            <Flex mt={3}>
              <Flex
                bg="backgroundSecondary"
                width={40}
                height={40}
                borderRadius="50%"
                justifyContent="center"
                alignItems="center"
              >
                <Image src={ether} width={48 / 2} height={48 / 2} />
              </Flex>
              <Box ml={3}>
                <P fontSize={14} color="rgba(255,255,255,0.7)">
                  Ether
                </P>
                <P>{formatEth(currentUser.balance)}</P>
              </Box>
            </Flex>

            <Flex justifyContent="center" pt={3}>
              <Pane borderRadius="300px">
                <Flex p={2} px={3} pl={2} alignItems="center">
                  <Box
                    width={14}
                    height={14}
                    bg={currentUser.chainId == 1 ? "#9ce69c" : "yellow"}
                    borderRadius="50%"
                    mr={2}
                  />
                  <P fontSize={12}>{getChainName(currentUser.chainId)}</P>
                </Flex>
              </Pane>
            </Flex>
          </Box>
          <Box
            p={3}
            sx={{
              transition: "background-color 300ms ease-in-out",
              "&:hover": {
                bg: "rgba(255,255,255,0.2)"
              },
              cursor: "pointer"
            }}
            onClick={logOut}
            borderTop="1px solid rgba(255, 255, 255, 0.2)"
            textAlign="center"
          >
            <P fontWeight={600}>Disconnect</P>
          </Box>
        </Pane>
      </Popover.Panel>
    </Popover>
  );
};

export default Account;
