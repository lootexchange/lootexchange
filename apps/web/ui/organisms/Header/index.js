import { useState } from "react";
import { Flex, Box, H1, P, Logo, Image, Button } from "@ui";
import useCurrentUser from "@hooks/useCurrentUser";
import Link from "next/link";
import { FaBars, FaCaretDown } from "react-icons/fa";

import SearchInput from "./GlobalSearch";
import Account from "./Account";
import Sidebar from "./Sidebar";
import NavDropdown from "../NavDropdown";

export const NavItem = ({ ...props }) => (
  <P color="textSecondary" fontWeight={600} fontSize={2} {...props} />
);

const collections = [
  {
    label: "Loot",
    href: "/collections/loot",
    image: "/lootCollectionLogo-small.png"
  },
  {
    label: "mLoot",
    href: "/collections/more-loot",
    image: "/mLootCollectionLogo-small.png"
  },
  {
    label: "Genesis",
    href: "/collections/genesisadventurer",
    image: "/genesisCollectionLogo-small.png"
  }
];

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
      <Sidebar
        open={open}
        onClose={() => setOpen(false)}
        collections={collections}
      />
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
            width="360px"
            placeholder="Search by collection, bag #, item, address, or ens"
          />

          {false && (
            <Link href="/">
              <a>
                <NavItem ml={4}>Adventures</NavItem>
              </a>
            </Link>
          )}

          <NavDropdown
            ml={4}
            button={
              <NavItem>
                <Flex alignItems="center">
                  <Box mr={1}>Collections</Box>
                  <FaCaretDown />
                </Flex>
              </NavItem>
            }
            items={collections}
          />

          {false && (
            <Link href="/">
              <a>
                <NavItem ml={4}>Players</NavItem>
              </a>
            </Link>
          )}
        </Flex>
        {currentUser && (
          <Flex mr={4}>
            <Link href={`/adventurers/${currentUser.address}`}>
              <a>
                <NavItem>Inventory</NavItem>
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
