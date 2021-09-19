import { Heading } from "rebass";

const H3 = ({ ...props }) => (
  <Heading
    as="h3"
    color="white"
    fontSize="16px"
    fontFamily="body"
    fontWeight={600}
    {...props}
  />
);

export default H3;
