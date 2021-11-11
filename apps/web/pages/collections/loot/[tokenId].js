import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useItem from "@hooks/useItem";

import useCollection from "@hooks/useCollection";
import useContractName, { nameToContractMap } from "@hooks/useContractName";

import PriceBox from "@ui/organisms/Item/PriceBox";
import AttributeTable from "@ui/organisms/Item/AttributeTable";
import Item from "@ui/organisms/Item";

import { Pane } from "@ui";
import NFT from "@ui/organisms/NFT";

import getGreatness from "../../../services/getGreatness";

import { sortItems } from "@utils";

const Bag = () => {
  const [claimables, setClaimables] = useState(null);
  const [items, setItems] = useState([]);

  let { collection: c, contract } = nameToContractMap.loot;
  const collection = useCollection(c);
  const router = useRouter();
  const { tokenId: id } = router.query;
  const [metaData, setMetaData] = useState(null);
  const { item, owner } = useItem(contract, id);

  useEffect(() => {
    const fetchClaimables = async () => {
      let result = await fetch(
        `https://loot-watcher.herokuapp.com/bags/${id}/projects`
      ).then(res => res.json());
    };

    if (false) {
      fetchClaimables();
    }
  }, [id]);

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

    fetchAttributes();
  }, [id]);

  return (
    <Item
      item={item}
      leftColumn={
        <NFT
          bag={{
            ...item,
            characterImage: `https://api.lootcharacter.com/imgs/bags/${(
              "0000" + (item ? item.id : 0)
            ).slice(-4)}.png`
          }}
          lens="characters"
          noData
        />
      }
      rightColumn={
        <>
          <PriceBox item={item} owner={owner} collection={collection} />
          <AttributeTable attributes={items} item={item} metaData={metaData} />
        </>
      }
    />
  );
};

export default Bag;
