import { useState, useEffect } from "react";
import { Box, Flex } from "@ui";
import api from "@api";
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
  const [items, setItems] = useState([]);

  useEffect(() => {
    const getMetadata = async () => {
      setMetaData(getGreatness(bag.id));
    };

    getMetadata();
  }, [bag]);

  useEffect(() => {
    const fetchAttributes = async () => {
      let result = await api(
        bag.contract,
        `tokens/${bag.id}/attributes`,
        "contracts"
      );

      setItems(sortItems(result.attributes));
    };

    fetchAttributes();
  }, [bag]);

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
              greatness={
                metaData ? metaData.greatness[attribute.key.toLowerCase()] : 0
              }
              showRarity={true}
            />
          ))}
        </CardContent>
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
