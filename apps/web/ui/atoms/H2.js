import { Heading } from "rebass";

const H2 = ({ ...props }) => (
  <Heading
    as="h2"
    color="white"
    fontSize="32px"
    fontFamily="EB Garamond,serif"
    fontWeight={600}
    {...props}
  />
);

export default H2;
