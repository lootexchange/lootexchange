import { useState } from "react";
import { Flex, Box, H1, P, Logo, Image, Button } from "@ui";
import useCurrentUser from "@hooks/useCurrentUser";
import Link from "next/link";
import { FaBars } from "react-icons/fa";

import SearchInput from "./GlobalSearch";
import Account from "./Account";
import Sidebar from "./Sidebar";

export const NavItem = ({ ...props }) => (
  <P color="textSecondary" fontWeight={600} fontSize={2} {...props} />
);

const Header = () => {
  const currentUser = useCurrentUser();
  const [open, setOpen] = useState(false);

  return (
    <Flex
      p={3}
      justifyContent="space-between"
      bg="background"
      position="relative"
      alignItems={["flex-start", "flex-start", "center", "center"]}
    >
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Link href="/">
        <a>
          <Logo width={257 / 2.5} height={98 / 2.5} />
        </a>
      </Link>
      <Box display={["flex", "flex", "none", "none"]}>
        <FaBars
          size={32}
          onClick={() => setOpen(true)}
          color="rgba(255,255,255,0.8)"
        />
      </Box>
      <Box
        display={["none", "none", "flex", "flex"]}
        flex={1}
        alignItems="center"
      >
        <Flex mx={4} flex={1} alignItems="center">
          <SearchInput
            width="400px"
            placeholder="Search by bag #, item, address, or ens"
          />

          <Link href="/">
            <a>
              <NavItem ml={4}>Loot Bags</NavItem>
            </a>
          </Link>
        </Flex>
        {currentUser && (
          <Flex mr={4}>
            <Link href={`/adventurers/${currentUser.address}`}>
              <a>
                <NavItem>My Loot</NavItem>
              </a>
            </Link>
          </Flex>
        )}
        <Account />
      </Box>
    </Flex>
  );
};

export default Header;
