import { Heading } from "rebass";

const H2 = ({ ...props }) => (
  <Heading
    as="h2"
    color="white"
    fontSize={["28px", "32px"]}
    fontFamily="body"
    fontWeight={600}
    {...props}
  />
);

export default H2;
