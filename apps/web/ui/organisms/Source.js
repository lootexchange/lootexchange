import exchangeIcon from "../../public/exchangeIcon2.svg";
import openSeaIcon from "../../public/openseaIcon.svg";
import { Image, Box, Flex } from "@ui";

const Source = ({ source, size = 30, ...props }) => (
  <Flex {...props}>
    <Image
      src={source === "LootExchange" ? exchangeIcon : openSeaIcon}
      width={size}
      height={size}
      alt="source"
    />
  </Flex>
);

export default Source;
