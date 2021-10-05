import { useState, useEffect } from "react";
import { Pane, Box, P, Checkbox, Flex, Loader } from "@ui";
import SearchInput from "@ui/organisms/Header/SearchInput";
import styled from "@emotion/styled";
import useAttributes from "@hooks/useAttributes";

import { Popover } from "@headlessui/react";

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 16px;
`;

const ItemSelector = ({ items = [], onChange }) => {
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const attributes = useAttributes();

  let category =
    selectedAttribute &&
    attributes &&
    attributes.find(a => a.key === selectedAttribute);
  console.log(category);

  return (
    <Popover.Panel
      static
      style={{ position: "absolute", left: 0, zIndex: 100 }}
    >
      <Pane
        bg="#0d0d0d"
        style={{
          boxShadow: "0px 5px 20px 6px black",
          border: "1px solid rgba(255, 255, 255, 0.2)"
        }}
        mt={2}
        width={600}
      >
        <Box p={3}>
          <SearchInput mb={3} autoFocus placeholder="search for items" />
          {selectedAttribute ? (
            <Box maxHeight={200} overflow="auto">
              <P
                fontSize={18}
                fontWeight={600}
                mb={3}
                onClick={() => setSelectedAttribute(null)}
                sx={{
                  textTransform: "capitalize"
                }}
              >
                {category.key}
              </P>

              {category.values.map(item => (
                <Flex
                  key={item.value}
                  mb={3}
                  alignItem="center"
                  justifyContent="space-between"
                >
                  <Flex>
                    <Checkbox />

                    <P ml={3}>{item.value}</P>
                  </Flex>
                  <P color="rgba(255,255,255,0.8)">({item.count})</P>
                </Flex>
              ))}
            </Box>
          ) : attributes ? (
            <Grid>
              {attributes.map(attribute => {
                return (
                  <Box
                    onClick={() => setSelectedAttribute(attribute.key)}
                    key={attribute.key}
                    p={3}
                    py={2}
                    borderRadius="default"
                    borderColor="borderColorAlt"
                    borderWidth={1}
                    sx={{
                      textTransform: "capitalize"
                    }}
                  >
                    <P letterSpacing="1px">
                      {attribute.key.toLocaleLowerCase()}
                    </P>
                  </Box>
                );
              })}
            </Grid>
          ) : (
            <Loader />
          )}
        </Box>
        <Box p={3} bg="rgba(255,255,255,0.1)">
          <P color="rgba(255,255,255,0.7)">
            Select some items to filter by them
          </P>
        </Box>
      </Pane>
    </Popover.Panel>
  );
};

export default ItemSelector;
