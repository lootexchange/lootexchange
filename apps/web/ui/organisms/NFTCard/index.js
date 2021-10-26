import styled from "@emotion/styled";
import { Pane, Flex, Box, Image, P } from "@ui";
import Marketplace from "@ui/organisms/Source";
import { rarityColor } from "loot-rarity";
import ether from "../../../public/ether.png";
import { positionToIcon } from "@utils";

// gotta clean this up
const NftContainer = styled.div`
  position: relative;
  width: 40%;

  height: 0;
  padding-bottom: 50%;

  @media (min-width: 920px) and (max-width: 1300px) {
    width: 40%;
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

export const CardContainer = ({ ...props }) => (
  <Pane
    height="100%"
    {...props}
    position="relative"
    display="flex"
    flexDirection="column"
  />
);

export const Source = ({ source }) => (
  <Box position="absolute" left={16} top={16}>
    <Marketplace source={source} size={25} />
  </Box>
);

export const CardBody = ({ children, ...props }) => (
  <Flex position="relative" flex={1} {...props}>
    {children}
  </Flex>
);

export const CardMedia = ({ children, ...props }) => (
  <NftContainer position="relative">
    <Box display={["none", "unset", "unset", "unset"]}>{children}</Box>
  </NftContainer>
);

export const CardContent = ({ ...props }) => (
  <Box
    p={3}
    pt={[4, 3, 3, 3]}
    pb={4}
    flex={1}
    style={{
      borderLeft: "1px solid rgba(255, 255, 255, 0.2)"
    }}
    borderLeftWidth={[0, "1px"]}
    {...props}
  />
);

export const CardFooter = ({ image, name, price, children, ...props }) => (
  <Box bg="#24222E">
    <Flex justifyContent="space-between" alignItems="center" pr={3}>
      <Flex alignItems="center" flex={1}>
        <img
          src={image}
          style={{
            width: 50,
            height: 50,
            borderBottomLeftRadius: 10
          }}
        />
        <Box ml={3}>
          <P>{name}</P>
        </Box>
      </Flex>

      {children && (
        <Box
          py={1}
          px={3}
          border="1px solid rgba(255,255,255,0.2)"
          borderRadius="100px"
        >
          {children}
        </Box>
      )}

      <Flex alignItems="center" justifyContent="flex-end" flex={1}>
        {price > 0 && (
          <>
            <Image src={ether} width={18} height={14} />
            <P color="textPrimary" fontWeight="700" fontSize={16}>
              {price}
            </P>
          </>
        )}
      </Flex>
    </Flex>
  </Box>
);

export const LootAttribute = ({
  attribute,
  greatness,
  showRarity,
  ...props
}) => (
  <Flex
    mb={"12px"}
    justifyContent="space-between"
    alignItems="flex-start"
    {...props}
  >
    <Flex alignItems="flex-start" flex={1}>
      <Box opacity={0.7}>
        <Image width={15} height={15} src={positionToIcon[attribute.key]} />
      </Box>
      <P flex={1} mx={2} fontSize={[12, 14, 14, 14]}>
        {attribute.value}
      </P>
    </Flex>
    <Box mt={"1px"}>
      <Greatness
        item={attribute.value}
        showRarity={showRarity}
        greatness={greatness}
      />
    </Box>
  </Flex>
);

export const Greatness = ({ greatness, item, showRarity }) => (
  <Flex alignItems="center">
    {showRarity && (
      <Flex
        display="none"
        mr={2}
        justifyContent="center"
        alignItems="flex-start"
        width={8}
        height={8}
        borderRadius="100%"
        bg={rarityColor(item)}
      />
    )}
    <P fontSize={11} minWidth={15} textAlign="right">
      {greatness}
    </P>
  </Flex>
);
