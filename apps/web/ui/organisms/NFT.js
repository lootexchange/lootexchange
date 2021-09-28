import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { Flex, Box, Pane, P, Image } from "@ui";
import { FaEye, FaList } from "react-icons/fa";
import Source from "@ui/organisms/Source";

import ether from "../../public/ether.png";

// gotta clean this up
const NftContainer = styled.div`
  border-radius: 15px;
  position: relative;
  width: 100%;

  height: 0;
  padding-bottom: 100%;
`;

const OpenContainer = styled.div`
  background: black;
  cursor: pointer;
  width: 35px;
  height: 35px;
  position: absolute;
  top: 12px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  z-index: 10;
  right: 12px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NFT = ({ bag, lens, noData, ...props }) => {
  const [viz, setViz] = useState(true);
  let image = lens === "loot" ? bag.image : bag.characterImage;

  useEffect(() => {
    setViz(true);
  }, [lens]);

  return (
    <Pane {...props}>
      {lens != "loot" && (
        <OpenContainer
          onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            e.nativeEvent.stopImmediatePropagation();
            setViz(!viz);
          }}
        >
          {viz ? (
            <FaList color="rgba(255, 255, 255, 0.7)" />
          ) : (
            <FaEye color="rgba(255, 255, 255, 0.7)" />
          )}
        </OpenContainer>
      )}
      <NftContainer>
        <img
          lazy="true"
          src={!viz ? bag.image : image}
          style={{
            padding: lens == "loot" || (!viz && lens == "characters") ? 10 : 0,
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
            objectFit: "cover"
          }}
        />
      </NftContainer>
      {!noData && (
        <Box p={3} style={{ borderTop: "2px solid rgba(255, 255, 255, 0.1)" }}>
          <Flex justifyContent="space-between" alignItems="center">
            <P flex={1}>{bag.name}</P>

            <Flex alignItems="center" justifyContent="center">
              {bag.source && (
                <Source size={23} source={bag.source} alignItems="center" />
              )}
            </Flex>
            <Flex alignItems="center" justifyContent="flex-end" flex={1}>
              {bag.isForSale && (
                <>
                  <Image src={ether} width={18} height={14} />
                  <P color="textPrimary" fontWeight="700" fontSize={16}>
                    {bag.price}
                  </P>
                </>
              )}
            </Flex>
          </Flex>
        </Box>
      )}
    </Pane>
  );
};

export default NFT;
