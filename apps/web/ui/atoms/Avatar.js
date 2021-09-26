import { Box } from "@ui";
import ReactHashAvatar from "react-hash-avatar";

const Avatar = ({ address = "test", size = 30, avatar, ...props }) => (
  <Box
    width={size}
    height={size}
    borderRadius="50%"
    overflow="hidden"
    {...props}
  >
    {avatar ? (
      <img
        alt={"avatar for " + address}
        src={avatar}
        style={{ width: size, height: size, objectFit: "cover" }}
      />
    ) : (
      <ReactHashAvatar
        name={address.toLocaleLowerCase()}
        width={size}
        height={size}
      />
    )}
  </Box>
);

export default Avatar;
