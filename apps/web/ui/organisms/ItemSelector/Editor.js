import { useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";

import { Pane, Box, P, Checkbox, Flex, Loader } from "@ui";
import { FaArrowLeft } from "react-icons/fa";
import SearchInput from "@ui/organisms/Header/SearchInput";
import styled from "@emotion/styled";
import useAttributes from "@hooks/useAttributes";
import { sortItems } from "@utils";
import Fuse from "fuse.js";

import { Popover } from "@headlessui/react";

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 16px;
`;

const ItemSelector = ({ item, onChange }) => {
  const fuse = useRef(null);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [debouncedQuery] = useDebounce(query, 300);

  const attributes = useAttributes();
  const items = attributes && sortItems(attributes);

  useEffect(() => {
    if (attributes) {
      let searchList = attributes.reduce(
        (o, attr) => [
          ...o,
          ...attr.values.map(value => ({
            key: attr.key,
            ...value
          }))
        ],
        []
      );

      fuse.current = new Fuse(searchList, {
        includeScore: true,
        keys: ["value"]
      });
    }
  }, [attributes]);

  let category =
    selectedAttribute && items && items.find(a => a.key === selectedAttribute);

  const handleSearch = async () => {
    if (fuse.current) {
      let results = fuse.current.search(debouncedQuery).slice(0, 8);
      setSearchResults(results.map(r => r.item));
    }
  };

  useEffect(() => {
    if (debouncedQuery.length > 0) {
      handleSearch();
    }
  }, [debouncedQuery]);

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
              <SearchInput
                mb={3}
                autoFocus
                placeholder="search for items"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />

              {debouncedQuery ? (
                <Box maxHeight={200} overflow="auto">
                  {searchResults.map(item => (
                    <Flex
                      onClick={() => {
                        onChange(item);
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
              ) : selectedAttribute ? (
                <Box maxHeight={200} overflow="auto">
                  <Flex mb={3} alignItems="center">
                    <FaArrowLeft />
                    <P
                      ml={2}
                      fontSize={18}
                      fontWeight={600}
                      onClick={() => setSelectedAttribute(null)}
                      sx={{
                        cursor: "pointer",
                        textTransform: "capitalize"
                      }}
                    >
                      {category.key}
                    </P>
                  </Flex>

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
              ) : items ? (
                <Grid>
                  {items.map(attribute => {
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
