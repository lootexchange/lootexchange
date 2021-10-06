import { Flex, Box, P } from "@ui";
import { RadioGroup } from "@headlessui/react";

const MyRadioGroup = ({ value, onChange, options, ...props }) => {
  return (
    <RadioGroup value={value} onChange={onChange}>
      <Flex {...props}>
        {options.map(({ key, value }, i) => (
          <RadioGroup.Option key={key} value={value}>
            {({ checked }) => (
              <Box
                py="14px"
                px="16px"
                bg={checked ? "rgb(37 34 47)" : "background"}
                color="textPrimary"
                borderTopLeftRadius={i == 0 ? "default" : 0}
                borderBottomLeftRadius={i == 0 ? "default" : 0}
                borderTopRightRadius={i + 1 == options.length ? "default" : 0}
                borderBottomRightRadius={
                  i + 1 == options.length ? "default" : 0
                }
                borderWidth={1}
                borderColor="borderColorAlt"
                fontFamily="body"
                fontSize="14px"
                fontWeight={700}
                borderRightWidth={i + 1 !== options.length ? 0 : 1}
                sx={{
                  cursor: "pointer"
                }}
              >
                <P>{key}</P>
              </Box>
            )}
          </RadioGroup.Option>
        ))}
      </Flex>
    </RadioGroup>
  );
};

export default MyRadioGroup;
