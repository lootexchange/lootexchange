import { Box, Flex } from "../../index";
import Header from "@ui/organisms/Header";
import BackArrow from "@ui/organisms/BackArrow";

const ItemContainer = ({ item, leftColumn, rightColumn }) => {
  return (
    <Box flex={1} flexDirection="column" bg="background">
      <Header />
      <Box p={3} pt={[1, 1, 1, 3]} maxWidth="large" margin="auto">
        <Flex>
          <BackArrow mb={3} />
        </Flex>
        {item && (
          <Flex flexWrap="wrap">
            <Box
              maxWidth="medium"
              width={[1, 1 / 2, 1 / 2, 1 / 2]}
              mb={[3, 0, 0]}
            >
              <Box mr={[0, 4, 4]}>{leftColumn}</Box>
            </Box>
            <Flex flexDirection="column" width={[1, 1 / 2, 1 / 2, 1 / 2]}>
              {rightColumn}
            </Flex>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default ItemContainer;
