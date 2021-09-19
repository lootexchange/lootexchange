import { Box } from "@ui";
import styled from "@emotion/styled";

export default styled(Box)`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 24px;

  @media (min-width: 520px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 820px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media (min-width: 1520px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;
