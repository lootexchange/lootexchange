import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { parse } from "svg-parser";
import useItem from "@hooks/useItem";

import useCollection from "@hooks/useCollection";
import useContractName, { nameToContractMap } from "@hooks/useContractName";

import PriceBox from "@ui/organisms/Item/PriceBox";
import AttributeTable from "@ui/organisms/Item/AttributeTable";
import Item from "@ui/organisms/Item";

import { Pane } from "@ui";
import NFT from "@ui/organisms/NFT";

import getGreatness from "../../../services/getGreatness";

import { sortItems, positions } from "@utils";

const Bag = () => {
  let contract = nameToContractMap.mloot;
  const [items, setItems] = useState([]);
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
  console.log(items);

  useEffect(() => {
    const parseImage = async () => {
      try {
        let result = await fetch(item.image).then(res => res.text());
        let parsedSvg = parse(result);

        let nodes = parsedSvg.children[0].children
          .filter(tag => {
            return tag.tagName == "text";
          })
          .map(node => node.children[0].value);

        let newItems = nodes.map((item, i) => {
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

    if (item) {
      parseImage();
    }
  }, [item]);

  return (
    <Item
      item={item}
      leftColumn={
        <Pane>
          {item && <img src={item.image} style={{ width: "100%" }} />}
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
          />
        </>
      }
    />
  );
};

export default Bag;
