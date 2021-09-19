import { Box, Avatar } from "@ui";
import styled from "@emotion/styled";
import useCurrentUser from "@hooks/useCurrentUser";

import { useRecoilState } from "recoil";
import { currentUser as currentUserAtom } from "../../../atoms";

import ethers from "../../../ethers";

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
    setCurrentUser(ethers.user);
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
    <Box position="relative">
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
    </Box>
  );
};

export default Account;
