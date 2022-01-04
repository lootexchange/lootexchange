import { Box, Flex, P } from "@ui";
import {
  CardBody,
  CardContainer,
  CardContent,
  CardFooter,
  CardMedia,
  Greatness,
  LootAttribute
} from "../NFTCard";
import { shortenAddress, sortItems } from "@utils";

import { customCollectionData } from "@hooks/useCollection";

const SyntheticLoot = ({ item: bag, address }) => {
  const collection = customCollectionData[bag.collection];
  return (
    <CardContainer>
      <CardBody>
        <CardMedia>
          <Flex
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            position="absolute"
            top={0}
            bottom={0}
            right={0}
            left={0}
          >
            <Box mb={2}>
              <img
                src={collection.image}
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "contain"
                }}
              />
            </Box>
            <P color="textSecondary">{collection.name}</P>
          </Flex>
        </CardMedia>
        <CardContent p={0} pt={0} pb={0}>
          <img
            src={bag.image}
            style={{
              width: "100%",
              height: "100%",
              maxHeight: 400,
              objectFit: "contain"
            }}
          />
        </CardContent>
      </CardBody>
      <CardFooter name={bag.name} image="/exchangeLogoSmall.png"></CardFooter>
    </CardContainer>
  );
};

export default SyntheticLoot;
