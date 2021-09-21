import styled from "@emotion/styled";
import { position, space } from "styled-system";

const Checkbox = styled.input`
  appearance: none;
  background: #eeeeee;
  width: 25px;
  height: 25px;
  margin: 0;
  display: block;
  border-radius: 5px;
  position: relative;
  transition: background 300ms ease-in-out;

  &:checked {
    color: #99a1a7;
    background: rgb(41 63 215);
  }

  &:checked::after {
    content: "✓";
    font-size: 18px;
    position: absolute;
    top: 2px;
    left: 6px;
    color: white;
  }

  ${space}
  ${position}
`;

Checkbox.defaultProps = {
  type: "checkbox"
};

export default Checkbox;
