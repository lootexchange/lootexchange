import { Box, Flex } from "@ui";
import {
  CardBody,
  CardContainer,
  CardContent,
  CardFooter,
  CardMedia,
  Greatness,
  LootAttribute,
  Source
} from "../NFTCard";
import { useEffect, useState } from "react";

import api from "@api";
import getGreatness from "../../../services/getGreatness";
import { lootRarity } from "loot-rarity";
import { sortItems } from "@utils";

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
      let result = await fetch("/api/metadata/" + bag.id).then(res =>
        res.json()
      );

      let items = Object.entries(result.items).map(([key, value]) => ({
        key: key,
        value: value
      }));

      setItems(sortItems(items));
    };

    fetchAttributes();
  }, [bag]);

  let chsaracterImage = `https://api.lootcharacter.com/imgs/bags/${(
    "0000" + bag.tokenId
  ).slice(-4)}.png`;

  let characterImage = "/api/image/swag/0/" + bag.tokenId;

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
          {false && (
            <Box
              position="absolute"
              bottom={0}
              zIndex={10}
              height="10%"
              left={0}
              right={0}
              bg="black"
            />
          )}
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
