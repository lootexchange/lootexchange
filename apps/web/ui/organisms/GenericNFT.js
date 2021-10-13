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

const NFT = ({ item, noData, ...props }) => {
  return (
    <Pane {...props}>
      <NftContainer>
        <img
          src={item.image}
          style={{
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
            <P flex={1}>{item.name}</P>

            <Flex alignItems="center" justifyContent="center">
              {item.source && (
                <Source size={23} source={bag.source} alignItems="center" />
              )}
            </Flex>
            <Flex alignItems="center" justifyContent="flex-end" flex={1}>
              {item.isForSale && (
                <>
                  <Image src={ether} width={18} height={14} />
                  <P color="textPrimary" fontWeight="700" fontSize={16}>
                    {item.price}
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
