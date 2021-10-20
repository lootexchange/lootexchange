import { useState, useEffect } from "react";
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

  useEffect(() => {
    const parseImage = async () => {
      try {
        let result = await fetch(bag.image).then(res => res.text());
        let parsedSvg = parse(result);

        let nodes = parsedSvg.children[0].children.filter(tag => {
          return tag.tagName == "text";
        });

        let itemNodes = nodes.slice(0, -1).map(node => node.children[0].value);

        let name = nodes[nodes.length - 1].children[0].value;
        let match = name.match(/(?<=Genesis Adventurer ).*(?= #)/g)[0];

        setOrder(match);

        let newItems = itemNodes.map((item, i) => {
          return {
            key: positions[i],
            value: item
          };
        });

        setItems(newItems);
      } catch (err) {
        console.log(err);
      }
    };

    parseImage();
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

        {bag.isForSale && <Source source={bag.source} />}
      </CardBody>
      <CardFooter
        name={bag.name}
        image={"/genesisCollectionLogo-small.png"}
        price={bag.price}
      />
    </CardContainer>
  );
};

export default Genesis;
