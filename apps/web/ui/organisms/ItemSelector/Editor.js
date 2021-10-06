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

const ItemSelector = ({ item, onChange }) => {
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const attributes = useAttributes();

  let category =
    selectedAttribute &&
    attributes &&
    attributes.find(a => a.key === selectedAttribute);

  return (
    <Box
      position="absolute"
      left={["unset", "uset", 0, 0]}
      right={[0, 0, "unset", "unset"]}
      zIndex={100}
      sx={{}}
    >
      <Popover.Panel static>
        {({ close }) => (
          <Pane
            bg="#0d0d0d"
            style={{
              boxShadow: "0px 5px 20px 6px black",
              border: "1px solid rgba(255, 255, 255, 0.2)"
            }}
            mt={2}
            width={450}
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
                      cursor: "pointer",
                      textTransform: "capitalize"
                    }}
                  >
                    {category.key}
                  </P>

                  {category.values.map(item => (
                    <Flex
                      onClick={() => {
                        onChange({ key: category.key, ...item });
                        close();
                      }}
                      key={item.value}
                      mb={3}
                      alignItem="center"
                      justifyContent="space-between"
                      sx={{ cursor: "pointer" }}
                    >
                      <P>{item.value}</P>
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
                          cursor: "pointer",
                          textTransform: "capitalize",
                          "&:hover": {
                            background: "rgb(37 34 47)"
                          }
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
            <Flex
              p={3}
              bg="rgba(255,255,255,0.1)"
              justifyContent="space-between"
            >
              <P color="rgba(255,255,255,0.7)">
                {item ? item.value : "Select an item to filter by"}
              </P>
              {item && (
                <P
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    onChange(null);
                    close();
                  }}
                >
                  Clear
                </P>
              )}
            </Flex>
          </Pane>
        )}
      </Popover.Panel>
    </Box>
  );
};

export default ItemSelector;
