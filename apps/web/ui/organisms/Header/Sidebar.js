import { Box, Flex, Avatar, P, Pane, Image, Button } from "@ui";
import { FaTimes } from "react-icons/fa";
import Link from "next/link";
import useCurrentUser from "@hooks/useCurrentUser";
import eth from "../../../ethers";
import ether from "../../../public/ether.png";
import { formatEth, getChainName, shortenAddress } from "@utils";
import { NavItem } from "./index";
import GlobalSearch from "./GlobalSearch";
import Account from "./Account";

const Sidebar = ({ open, onClose }) => {
  const currentUser = useCurrentUser();

  const logOut = async () => {
    await eth.logOut();
  };

  return (
    <Box
      display={["block", "block", "none", "none"]}
      position="fixed"
      right="0"
      top="0"
      width={"100%"}
      zIndex={100}
      height="100vh"
      maxWidth={"400px"}
      borderLeft="1px solid rgba(255,255,255,0.3)"
      bg="background"
      sx={{
        transition: "transform 300ms ease-in-out",
        transform: `translateX(${open ? 0 : "100%"})`
      }}
    >
      <Flex flexDirection="column" height="100%">
        <Box p={3}>
          <Flex onClick={onClose} mb={4} sx={{ cursor: "pointer" }}>
            <FaTimes fontSize={24} />
            <P ml={2}>Close</P>
          </Flex>

          <GlobalSearch placeholder="Search by bag #, item, address, or ens" />
        </Box>

        {currentUser ? (
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
                  {shortenAddress(currentUser.address)}
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
        ) : (
          <Flex p={3} pb={0}>
            <Account />
          </Flex>
        )}
        <Box p={3}>
          {currentUser && (
            <Flex mt={4}>
              <Link href={`/adventurers/${currentUser.address}`}>
                <a>
                  <NavItem>My Loot</NavItem>
                </a>
              </Link>
            </Flex>
          )}

          <Flex mt={4}>
            <Link href={`/`}>
              <a>
                <NavItem>Loot Bags</NavItem>
              </a>
            </Link>
          </Flex>
        </Box>
        <Box flex={1} />
        {currentUser && (
          <Box p={3}>
            <Button onClick={logOut} color="white">
              Disconnect
            </Button>
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default Sidebar;
