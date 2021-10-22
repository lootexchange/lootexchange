import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { parse } from "svg-parser";
import useItem from "@hooks/useItem";

import useCollection from "@hooks/useCollection";
import useContractName, { nameToContractMap } from "@hooks/useContractName";

import PriceBox from "@ui/organisms/Item/PriceBox";
import AttributeTable from "@ui/organisms/Item/AttributeTable";
import Item from "@ui/organisms/Item";
import { orders } from "@ui/organisms/NFTs/genesis";

import { Pane, Flex, P, Box } from "@ui";
import NFT from "@ui/organisms/NFT";

import getGreatness from "../../../services/getGreatness";

import { sortItems, positions } from "@utils";

const Bag = () => {
  let contract = nameToContractMap.genesis;

  const [items, setItems] = useState([]);
  const [order, setOrder] = useState(null);

  const collection = useCollection(contract);
  const router = useRouter();
  const { tokenId: id } = router.query;
  const [metaData, setMetaData] = useState(null);
  const { item, owner } = useItem(contract, id);

  useEffect(() => {
    const getMetadata = async () => {
      setMetaData(getGreatness(id));
    };

    if (id) {
      getMetadata();
    }
  }, [id]);
  useEffect(() => {
    const parseImage = async () => {
      try {
        let result = await fetch(item.image).then(res => res.text());
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
  }, [item]);

  return (
    <Item
      item={item}
      leftColumn={
        <Pane position="relative">
          {item && (
            <Flex
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              py={5}
            >
              <Box mb={2} width={1} maxWidth={300}>
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
              <P mt={3} color="textSecondary" textAlign="center">
                Genesis Adventurer
                <br />
                {order ? order : "of ___"}
              </P>
            </Flex>
          )}
        </Pane>
      }
      rightColumn={
        <>
          <PriceBox item={item} owner={owner} collection={collection} />
          <AttributeTable
            attributes={items}
            item={item}
            metaData={metaData}
            showRarity={false}
            showGreatness={false}
          />
        </>
      }
    />
  );
};

export default Bag;
