import { Flex, P } from "@ui";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/router";

const BackArrow = props => {
  const router = useRouter();

  return (
    <Flex
      onClick={() => (props.to ? router.replace(props.to) : router.back())}
      alignItems="center"
      style={{ cursor: "pointer" }}
      {...props}
    >
      <FaArrowLeft size={16} color="white" />
      <P ml={2} style={{ fontSize: 16 }}>
        Back
      </P>
    </Flex>
  );
};

export default BackArrow;
