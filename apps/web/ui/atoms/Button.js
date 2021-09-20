import styled from "@emotion/styled";
import { Button as RButton } from "rebass";

const Button = props => (
  <RButton
    fontFamily="body"
    bg="rgb(41 63 215)"
    color="black"
    fontSize={18}
    px={4}
    width={1}
    py={3}
    fontWeight={600}
    sx={{
      cursor: "pointer",
      borderRadius: 10
    }}
    {...props}
  />
);

export default Button;
