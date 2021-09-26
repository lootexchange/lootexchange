import { Input as RInput } from "@rebass/forms";
import styled from "@emotion/styled";

const Input = ({ ...props }) => (
  <RInput
    bg="#0f0f0f"
    py="14px"
    px="10px"
    fontFamily="body"
    fontSize={14}
    {...props}
  />
);

export default styled(Input)`
  outline: none;
  transition: 300ms background ease-in-out;
  border-color: rgba(255, 255, 255, 0.2);

  &:focus {
    background: rgba(255, 255, 255, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &::-webkit-outer-spin-button,
  *::-webkit-inner-spin-button {
    display: none;
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
  }
`;
