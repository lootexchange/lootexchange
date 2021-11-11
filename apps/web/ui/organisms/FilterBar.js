import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import { Flex, Box, Select, Pane, P } from "@ui";
import { FaPlus, FaArrowDown, FaTimes } from "react-icons/fa";
import useAttributes from "@hooks/useAttributes2";
import { IconButton } from "../../pages/collections/[contract]";
import { Listbox } from "@headlessui/react";
import { customCollectionData } from "@hooks/useCollection";

export const Container = ({ active, children, ...props }) => (
  <Box
    p={3}
    borderRadius="default"
    borderColor="borderColorAlt"
    borderWidth={1}
    {...props}
  >
    <P color={active ? "white" : "textSecondary"} lineHeight={1}>
      {children}
    </P>
  </Box>
);

const Button = styled(Listbox.Button)`
  & .x {
    transition: 300ms opacity ease-in-out, 300ms transform ease-in-out;
    opacity: 0;
    transform: scale(0.09);
    pointer-events: none;
  }
  &:hover .x {
    opacity: 1;
    transform: scale(1);
    pointer-events: all;
  }
`;

const removeEmpty = obj =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));

const FilterBar = ({ id, onChange }) => {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState([]);
  const [selections, setSelections] = useState({});
  const attributes = useAttributes(id);

  useEffect(() => {
    onChange(removeEmpty(selections));
  }, [selections]);

  useEffect(() => {
    setSelections([]);
  }, [id]);

  useEffect(() => {
    const updateProperties = () => {
      setProperties(attributes.map(attr => attr.key));

      let collection = customCollectionData[id];

      if (collection && collection.filterPreference) {
        return setFilters(
          attributes.filter(
            attr => collection.filterPreference.indexOf(attr.key) !== -1
          )
        );
      }

      setFilters(attributes.slice(0, 3));
    };

    if (attributes) {
      updateProperties();
    }
  }, [attributes]);

  const changeFilter = filter => {
    let updatedSelections = { ...selections };
    updatedSelections[filter.key] = filter.value;

    console.log(updatedSelections);
    setSelections(updatedSelections);
  };

  const removeFilter = toRemovekey => {
    setFilters(filters.filter(f => f.key !== toRemovekey));
    changeFilter({
      key: toRemovekey,
      value: ""
    });
  };

  const addFilter = newFilter => {
    setFilters([newFilter, ...filters]);
  };

  return (
    <Flex>
      <Box position="relative">
        <Listbox value={"hi"} onChange={filter => addFilter(filter)}>
          <Listbox.Button>
            <IconButton icon={<FaPlus />} />
          </Listbox.Button>

          <Listbox.Options
            style={{
              position: "absolute",
              top: 70,
              left: 0,
              zIndex: 100,
              maxHeight: 420,
              width: 420,
              borderRadius: 15,
              overflow: "auto",
              boxShadow: "0px 5px 20px 6px black",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              backgroundColor: "#0d0d0d"
            }}
          >
            {attributes.length !== filters.length ? (
              attributes
                .filter(
                  attr =>
                    filters.map(filter => filter.key).indexOf(attr.key) == -1
                )
                .map(attr => (
                  <Listbox.Option key={attr.key} value={attr}>
                    <Box
                      p={3}
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          background: "rgba(255,255,255,0.1)"
                        }
                      }}
                    >
                      <P>{attr.key}</P>
                    </Box>
                  </Listbox.Option>
                ))
            ) : (
              <Box p={3}>
                <P color="textSecondary">All filters used</P>
              </Box>
            )}
          </Listbox.Options>
        </Listbox>
      </Box>

      {filters.map(filter => (
        <Box key={filter.key} position="relative" ml={3}>
          <Listbox onChange={changeFilter}>
            <Button>
              <Container active={selections[filter.key]}>
                {selections[filter.key] || filter.key}
              </Container>
              <Flex
                onClick={() => removeFilter(filter.key)}
                className="x"
                position="absolute"
                justifyContent="center"
                alignItems="center"
                right={-14}
                top={10}
                border="1px solid rgba(255,255,255,0.2)"
                borderRadius="50%"
                sx={{
                  width: 24,
                  height: 24
                }}
                bg="background"
              >
                <FaTimes />
              </Flex>
            </Button>

            <Listbox.Options
              style={{
                position: "absolute",
                top: 70,
                left: 0,
                zIndex: 100,
                maxHeight: 420,
                width: 420,
                borderRadius: 15,
                overflow: "auto",
                boxShadow: "0px 5px 20px 6px black",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                backgroundColor: "#0d0d0d"
              }}
            >
              <Listbox.Option
                selected
                value={{
                  key: filter.key,
                  value: ""
                }}
                label={filter.key}
              >
                <Box
                  p={3}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      background: "rgba(255,255,255,0.1)"
                    }
                  }}
                >
                  <P>All</P>
                </Box>
              </Listbox.Option>
              {filter.values.map(value => (
                <Listbox.Option
                  key={value.value}
                  value={{
                    key: filter.key,
                    value: value.value
                  }}
                >
                  <Box
                    p={3}
                    sx={{
                      "&:hover": {
                        background: "rgba(255,255,255,0.1)"
                      },
                      cursor: "pointer"
                    }}
                  >
                    <P>{value.value}</P>
                  </Box>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
        </Box>
      ))}
    </Flex>
  );
};

export default FilterBar;
