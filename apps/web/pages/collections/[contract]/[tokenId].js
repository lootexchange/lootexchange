import { useState, useEffect } from "react";

import { useRouter } from "next/router";
import useItem from "@hooks/useItem";
import useCollection from "@hooks/useCollection";
import useContractName from "@hooks/useContractName";

import PriceBox from "@ui/organisms/Item/PriceBox";
import AttributeTable from "@ui/organisms/Item/AttributeTable";
import Item from "@ui/organisms/Item";

import { Pane } from "@ui";

const ItemScreen = () => {
  const { collection: c, contract, readableName } = useContractName();
  const collection = useCollection(c);
  const router = useRouter();
  const { tokenId: id } = router.query;
  const { item, owner } = useItem(contract, id);

  return (
    <Item
      item={item}
      leftColumn={
        <Pane>
          {item && <img style={{ width: "100%" }} src={item.image} />}
        </Pane>
      }
      rightColumn={
        <>
          <PriceBox item={item} owner={owner} collection={collection} />
          <AttributeTable
            attributes={item ? item.attributes : []}
            title="Attributes"
            item={item}
            showRarity={false}
            showGreatness={false}
          />
        </>
      }
    />
  );
};

export default ItemScreen;
