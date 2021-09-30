import { Input, Box } from "@ui";
import { FaSearch } from "react-icons/fa";

const SearchInput = props => (
  <Box position="relative">
    <Box position="absolute" left={17} top={17} zIndex={101}>
      <FaSearch color="rgba(255,255,255,0.9)" />
    </Box>
    <Input pl="46px" {...props} />
  </Box>
);

export default SearchInput;
