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
  let contract = nameToContractMap.loot;
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

  let attributes =
    item && item.attributes.length ? sortItems(item.attributes) : [];

  return (
    <Item
      item={item}
      leftColumn={
        <NFT
          bag={{
            ...item,
            characterImage: `https://api.lootcharacter.com/imgs/bags/${(
              "0000" + (item ? item.tokenId : 0)
            ).slice(-4)}.png`
          }}
          lens="characters"
          noData
        />
      }
      rightColumn={
        <>
          <PriceBox item={item} owner={owner} />
          <AttributeTable
            attributes={attributes}
            item={item}
            metaData={metaData}
          />
        </>
      }
    />
  );
};

export default Bag;
