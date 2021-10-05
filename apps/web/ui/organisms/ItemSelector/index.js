import { useState, useEffect } from "react";
import { Pane, Box, P, Checkbox, Flex } from "@ui";
import styled from "@emotion/styled";
import Editor from "./Editor";

import { Popover } from "@headlessui/react";
const ButtonWrapper = styled(Popover.Button)`
  color: white;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
`;

const ItemSelector = ({ items = [], onChange }) => {
  return (
    <Popover style={{ position: "relative" }}>
      {({ open }) => (
        <>
          <ButtonWrapper>
            <Box
              py="14px"
              px="16px"
              pl="42px"
              bg="background"
              color="textPrimary"
              borderRadius="default"
              borderWidth={1}
              borderColor="borderColorAlt"
              fontFamily="body"
              fontSize="14px"
              fontWeight={700}
              style={{
                WebkitAppearance: "none"
              }}
            >
              {items.length ? items.join(",") : "Filter by Item"}
            </Box>
          </ButtonWrapper>

          {open && <Editor items={items} onChange={onChange} />}
        </>
      )}
    </Popover>
  );
};

export default ItemSelector;
