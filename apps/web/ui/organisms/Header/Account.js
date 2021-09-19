import { Box, Avatar } from "@ui";
import styled from "@emotion/styled";

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
      textOverflow: "ellipsis"
    }}
    {...props}
  />
);

const Account = () => {
  const currentUser = {
    name: "lunarmayor.eth",
    address: "xasdfasdfsdf"
  };

  if (!currentUser) {
    return (
      <AccountContainer style={{ paddingRight: 24 }}>
        Connect to Wallet
      </AccountContainer>
    );
  }

  return (
    <Box position="relative">
      <AccountContainer>{currentUser.name}</AccountContainer>
      <Avatar
        size={30}
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
