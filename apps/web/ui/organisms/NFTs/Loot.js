import { useState, useEffect } from "react";
import { Box, Flex } from "@ui";
import {
  CardContainer,
  CardBody,
  CardMedia,
  CardContent,
  CardFooter,
  LootAttribute,
  Greatness,
  Source
} from "../NFTCard";

import { sortItems } from "@utils";
import { lootRarity } from "loot-rarity";
import getGreatness from "../../../services/getGreatness";

const Loot = ({ item: bag }) => {
  const [metaData, setMetaData] = useState(null);

  useEffect(() => {
    const getMetadata = async () => {
      setMetaData(getGreatness(bag.id));
    };

    getMetadata();
  }, [bag]);

  let items = bag && bag.attributes ? sortItems(bag.attributes) : [];

  let characterImage = `https://api.lootcharacter.com/imgs/bags/${(
    "0000" + bag.tokenId
  ).slice(-4)}.png`;

  return (
    <CardContainer>
      <CardBody>
        <CardMedia>
          <img
            src={characterImage}
            style={{
              //padding:
              // lens == "loot" || (!viz && lens == "characters") ? 10 : 0,
              width: "100%",
              height: "100%",
              position: "absolute",
              inset: 0,
              objectFit: "cover"
            }}
          />
          <Box
            position="absolute"
            bottom={0}
            zIndex={10}
            height="10%"
            left={0}
            right={0}
            bg="black"
          />
        </CardMedia>
        <CardContent>
          {items.map(attribute => (
            <LootAttribute
              attribute={attribute}
              key={attribute.key}
              greatness={metaData ? metaData.greatness[attribute.key] : 0}
              showRarity={true}
            />
          ))}
        </CardContent>
        {bag.isForSale && <Source source={bag.source} />}
      </CardBody>
      <CardFooter
        name={bag.name}
        image={"/lootCollectionLogo-small.png"}
        price={bag.price}
      >
        <Greatness
          item={lootRarity(items.map(i => i.value))}
          greatness={metaData ? metaData.scores.greatness : 0}
          showRarity
        />
      </CardFooter>
    </CardContainer>
  );
};

export default Loot;
