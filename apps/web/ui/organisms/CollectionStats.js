import { Flex, Box, P, Image } from "@ui";
import ether from "../../public/ether.png";

const Leadin = props => (
  <P fontSize="12px" fontWeight="300" color="white" {...props} />
);

const CollectionStats = ({ count, floor, ...props }) => (
  <Box {...props}>
    <Flex
      bg="#1b1b19"
      borderRadius="default"
      borderWidth={1}
      borderColor="rgba(255,255,255,0.05)"
    >
      <Box p={2} px={4} textAlign="center" borderRight="1px solid black">
        <Leadin>Bags</Leadin>
        <P>7.8k</P>
      </Box>
      <Box p={2} px={4} textAlign="center">
        <Leadin>Floor</Leadin>
        <Flex alignItems="center">
          <Box mt={1}>
            <Image alt="eth" src={ether} fixed="true" width={16} height={14} />
          </Box>
          <P>{floor}</P>
        </Flex>
      </Box>
    </Flex>
  </Box>
);

export default CollectionStats;
