import { Box } from "@ui";
import ReactHashAvatar from "react-hash-avatar";

const Avatar = ({ address = "test", size = 30, ...props }) => (
  <Box
    width={size}
    height={size}
    borderRadius="50%"
    overflow="hidden"
    {...props}
  >
    <ReactHashAvatar name={address} width={size} height={size} />
  </Box>
);

export default Avatar;
