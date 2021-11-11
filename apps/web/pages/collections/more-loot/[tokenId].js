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
  let { collection: c, contract } = nameToContractMap["more-loot"];
  const [items, setItems] = useState([]);
  const collection = useCollection(c);
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
    const fetchAttributes = async () => {
      let result = await fetch("/api/metadata/" + id).then(res => res.json());

      let items = Object.entries(result.items).map(([key, value]) => ({
        key: key,
        value: value
      }));

      setItems(sortItems(items));
    };
    alert(id);

    fetchAttributes();
  }, [id]);

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
