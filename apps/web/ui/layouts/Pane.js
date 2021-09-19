import styled from "@emotion/styled";
import Box from "./Box";
const Pane = styled(Box)`
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  position: relative;
  user-select: none;
  overflow: hidden;
`;

export default Pane;
