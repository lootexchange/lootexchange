import { Flex, Box } from "@ui";
import { Select as RSelect } from "@rebass/forms";
import { position, border, space, color, typography } from "styled-system";
import styled from "@emotion/styled";

const SystemSelect = styled.select`
  ${position}
  ${space}
  ${color}
  ${typography}
  ${border}
`;

const Select = ({
  icon,
  value,
  onChange,
  children,
  inputProps = {},
  ...props
}) => (
  <Box position="relative" {...props}>
    <Flex
      position="absolute"
      left="16px"
      top="50%"
      sx={{
        transform: "translate(0, -50%)"
      }}
    >
      {icon}
    </Flex>
    <SystemSelect
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
      value={value}
      onChange={onChange}
      {...inputProps}
    >
      {children}
    </SystemSelect>
  </Box>
);

export default Select;
