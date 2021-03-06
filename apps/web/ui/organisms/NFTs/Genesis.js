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

export const orders = [
  "",
  "of the Twins",
  "of Reflection",
  "of Rage",
  "of Enlightenment",
  "of Detection",
  "of the Fox",
  "of Anger",
  "of Brilliance",
  "of Titans",
  "of Giants",
  "of Power",
  "of Skill",
  "of Vitriol",
  "of Fury",
  "of Protection",
  "of Perfection"
];

const Genesis = ({ item: bag }) => {
  const [items, setItems] = useState([]);
  const [order, setOrder] = useState(null);
  const [greatness, setGreatness] = useState(null);

  useEffect(() => {
    const fetchAttributes = async () => {
      let result = await api(
        bag.contract,
        `tokens/${bag.id}/attributes`,
        "contracts"
      );

      let order = result.attributes.find(attribute => {
        return attribute.category === "Properties" && attribute.key === "Order";
      }).value;

      let greatness = result.attributes.find(attribute => {
        return (
          attribute.category === "Properties" && attribute.key === "Greatness"
        );
      }).value;

      setGreatness(greatness);

      setOrder("of " + order);
      setItems(sortItems(result.attributes));
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
            <Box p={4}>
              {order ? (
                <img
                  src={`/ordersLarge/${orders.indexOf(order)}.png`}
                  style={{
                    width: "100%"
                  }}
                />
              ) : (
                <img
                  src={`/defaultOrder.png`}
                  style={{
                    width: "100%"
                  }}
                />
              )}
            </Box>
            <P color="textSecondary" textAlign="center">
              Genesis Adventurer
              <br />
              {order ? order : "of ___"}
            </P>
          </Flex>
        </CardMedia>
        <CardContent>
          {items.map(attribute => (
            <LootAttribute
              attribute={attribute}
              key={attribute.key}
              showRarity={false}
              showGreatness={false}
            />
          ))}
        </CardContent>
      </CardBody>
      <CardFooter
        name={`GA #${bag.id}`}
        image={"/genesisCollectionLogo-small.png"}
        price={bag.price}
      >
        <Greatness greatness={greatness ? greatness : 0} />
      </CardFooter>
    </CardContainer>
  );
};

export default Genesis;
