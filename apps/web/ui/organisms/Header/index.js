import { Flex, Box, H1, P, Logo, Image } from "@ui";
import useCurrentUser from "@hooks/useCurrentUser";

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
      <Logo width={Math.floor(257 / 2.3)} height={Math.floor(98 / 2.3)} />
      <Flex mx={4} flex={1} alignItems="center">
        <SearchInput
          width="350px"
          placeholder="Search by bag #, address, or ens"
        />
        <NavItem ml={4}>Explore</NavItem>
        <NavItem ml={4}>Projects</NavItem>
      </Flex>
      {currentUser && (
        <Flex mr={4}>
          <NavItem>My Loot</NavItem>
        </Flex>
      )}
      <Account />
    </Flex>
  );
};

export default Header;
