import { Box, Flex, P } from "@ui";
import { useEffect, useState } from "react";
import useCurrentUser from "@hooks/useCurrentUser";
import { FaExclamationTriangle } from "react-icons/fa";
import { getChainName } from "@utils";

const ChainWrapper = ({ children, ...props }) => {
  let currentUser = useCurrentUser();

  return (
    <Box height="100%">
      {currentUser && !currentUser.onCorrectChain && (
        <Flex p={3} bg="#ff6024" alignItems="center">
          <FaExclamationTriangle />
          <P fontSize={14} ml={3}>
            You&apos;re on the wrong network. You&apos;re connected to{" "}
            {getChainName(currentUser.chainId)} but should be connected to{" "}
            {getChainName(process.env.NEXT_PUBLIC_CHAIN_ID)}.
          </P>
        </Flex>
      )}
      {children}
    </Box>
  );
};

export default ChainWrapper;
