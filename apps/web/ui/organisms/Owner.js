import { P, Avatar, Flex } from "@ui";

const Owner = ({ address, name, avatar, large, ...props }) => {
  let size = large ? 25 : 20;

  return (
    <Flex alignItems="center" {...props}>
      <Avatar size={size} address={address} avatar={avatar} />
      <P ml={2} style={{ fontSize: large ? 18 : 14 }}>
        {name}
      </P>
    </Flex>
  );
};
export default Owner;
