import { Box, P, Flex } from "@ui";
import {
  CardContainer,
  CardBody,
  CardMedia,
  CardContent,
  CardFooter,
  LootAttribute,
  Greatness
} from "../NFTCard";

import { sortItems, shortenAddress } from "@utils";

const SyntheticLoot = ({ bag, address }) => {
  let items = bag && bag.attributes ? sortItems(bag.attributes) : [];
  let metaData = bag.metadata;

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
                src="/synthLootCollectionLogo.png"
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%"
                }}
              />
            </Box>
            <P color="textSecondary">Synth Loot</P>
          </Flex>
        </CardMedia>
        <CardContent>
          {items.map(attribute => (
            <LootAttribute
              attribute={attribute}
              key={attribute.key}
              greatness={metaData ? metaData.greatness[attribute.key] : 0}
              showRarity={false}
            />
          ))}
        </CardContent>
      </CardBody>
      <CardFooter
        name={"Bag " + shortenAddress(address)}
        image={"/synthLootCollectionLogo.png"}
      >
        <Greatness greatness={metaData.scores.greatness} />
      </CardFooter>
    </CardContainer>
  );
};

export default SyntheticLoot;
