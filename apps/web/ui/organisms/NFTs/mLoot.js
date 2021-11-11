import { useState, useEffect } from "react";
import api from "@api";
import { parse } from "svg-parser";
import { Box, Flex, P } from "@ui";
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

import { sortItems, positions } from "@utils";
import { lootRarity } from "loot-rarity";
import getGreatness from "../../../services/getGreatness";

const Loot = ({ item: bag }) => {
  const [metaData, setMetaData] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const getMetadata = async () => {
      setMetaData(getGreatness(bag.tokenId));
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
                src="/mLootCollectionLogo-medium.png"
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%"
                }}
              />
            </Box>
            <P color="textSecondary">mLoot</P>
          </Flex>
        </CardMedia>
        <CardContent>
          {items.map(attribute => (
            <LootAttribute
              attribute={attribute}
              key={attribute.key}
              greatness={
                metaData ? metaData.greatness[attribute.key.toLowerCase()] : 0
              }
              showRarity={false}
            />
          ))}
        </CardContent>
      </CardBody>
      <CardFooter
        name={bag.name}
        image={"/mLootCollectionLogo-small.png"}
        price={bag.price}
      >
        <Greatness
          greatness={metaData ? metaData.scores.greatness : 0}
          showRarity={false}
        />
      </CardFooter>
    </CardContainer>
  );
};

export default Loot;
