import { Flex, Box, H1, P, Logo, Image } from "@ui";
import useCurrentUser from "@hooks/useCurrentUser";
import Link from "next/link";

import SearchInput from "./GlobalSearch";
import Account from "./Account";

const NavItem = ({ ...props }) => (
  <P color="textSecondary" fontWeight={600} fontSize={2} {...props} />
);

const Header = () => {
  const currentUser = useCurrentUser();

  return (
    <Flex
      p={3}
      justifyContent="space-between"
      bg="background"
      alignItems="center"
    >
      <Link href="/">
        <a>
          <Logo width={257 / 2.5} height={98 / 2.5} />
        </a>
      </Link>
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
    </Flex>
  );
};

export default Header;
