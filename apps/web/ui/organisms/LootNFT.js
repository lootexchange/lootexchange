import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { Flex, Box, Pane, P, Image } from "@ui";
import { FaEye, FaList } from "react-icons/fa";
import Source from "@ui/organisms/Source";
import Tilt from "react-parallax-tilt";

import ether from "../../public/ether.png";

// gotta clean this up
const NftContainer = styled.div`
  position: relative;
  width: 50%;

  height: 0;
  padding-bottom: 50%;
`;

const OpenContainer = styled.div`
  background: black;
  cursor: pointer;
  width: 35px;
  height: 35px;
  position: absolute;
  top: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 10;
  right: 12px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const colors = [
  "#838383",
  "#00DC82",
  "#2e82ff",
  "#c13cff",
  "#f8b73e",
  "#ff44b7"
];

const getColor = greatness => {
  if (greatness < 10) {
    return colors[0];
  }

  if (greatness > 10 && greatness <= 12) {
    return colors[1];
  }

  if (greatness > 12 && greatness <= 15) {
    return colors[2];
  }

  if (greatness > 15 && greatness <= 17) {
    return colors[3];
  }

  if (greatness > 17 && greatness <= 19) {
    return colors[4];
  }

  return colors[5];
};

const Greatness = ({ number }) => (
  <Flex justifyContent="center" alignItems="center">
    <Flex
      display="none"
      mr={2}
      justifyContent="center"
      alignItems="center"
      width={8}
      height={8}
      borderRadius="100%"
      bg={getColor(Math.floor(Math.random() * 19 + 1))}
    />
    <P fontSize={11} minWidth={15} textAlign="right">
      {number}
    </P>
  </Flex>
);

const NFT = ({ bag, lens, noData, ...props }) => {
  const [viz, setViz] = useState(true);
  let image = lens === "loot" ? bag.image : bag.characterImage;

  useEffect(() => {
    setViz(true);
  }, [lens]);

  return (
    <Pane
      {...props}
      position="relative"
      //style={{ borderWidth: 4, borderColor: "rgba(255,255,255,0.25)" }}
    >
      <Box position="absolute" top={0} right={0} left={0} bottom="0" />
      <Flex position="relative">
        <NftContainer
          position="relative"
          style={{
            borderRight: "1px solid rgba(255, 255, 255, 0.2)"
          }}
        >
          <img
            src={bag.characterImage}
            style={{
              padding:
                lens == "loot" || (!viz && lens == "characters") ? 10 : 0,
              width: "100%",
              height: "100%",
              position: "absolute",
              inset: 0,
              objectFit: "cover"
            }}
          />
          <Box
            position="absolute"
            bottom={0}
            height={0}
            left={0}
            right={0}
            bg="black"
          />
        </NftContainer>

        <NftContainer>
          <Box p={3}>
            {bag.attributes.map(attribute => (
              <Flex
                mb={2}
                justifyContent="space-between"
                alignItems="center"
                key={attribute.key}
              >
                {false && (
                  <Flex
                    display="none"
                    mr={2}
                    justifyContent="center"
                    alignItems="center"
                    width={8}
                    height={8}
                    borderRadius="100%"
                    bg={getColor(Math.floor(Math.random() * 19 + 1))}
                  />
                )}
                <P flex={1} mr={2} fontSize={[12, 14, 14, 14]}>
                  {attribute.value}
                </P>
                <Greatness number={Math.floor(Math.random() * 19 + 1)} />
              </Flex>
            ))}
          </Box>
        </NftContainer>
        {bag.source && (
          <Box position="absolute" left={12} top={12}>
            <Source size={23} source={bag.source} alignItems="center" />
          </Box>
        )}
      </Flex>
      {!noData && (
        <Box p={3} bg="#24222E">
          <Flex justifyContent="space-between" alignItems="center">
            <P flex={1}>{bag.name}</P>

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
