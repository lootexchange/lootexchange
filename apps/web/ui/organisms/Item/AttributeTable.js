import { Pane, Box, Flex, H2, P } from "@ui";
import {
  itemRarity,
  rarityColor,
  rarityDescription,
  lootRarity
} from "loot-rarity";
const column = 120;

const LootAttributeTable = ({
  item: bag,
  title = "Stats",
  attributes,
  showRarity = true,
  metaData,
  showGreatness = true
}) => {
  return (
    <Pane flex={1} display="flex" flexDirection="column" bg="rgb(22 22 22)">
      <Box>
        <Flex p={[3, 3, 4]} alignItems="center">
          <H2 fontSize={22}>{title}</H2>
          <Box flex={1} />
          <Flex alignItems="center">
            {showRarity && <P>Rarity</P>}

            {showGreatness && (
              <P textAlign="right" width={column}>
                Greatness
              </P>
            )}
          </Flex>
        </Flex>

        <Flex
          py={3}
          px={[3, 3, 4]}
          alignItems="ceter"
          borderTop="1px solid rgba(255,255,255,0.1)"
        >
          <Box flex={1}>
            <P fontSize={14} color="rgba(255,255,255, 0.8)" mr={3}></P>
            <P color="white" fontSize={16} fontWeight={600}>
              {bag.name}
            </P>
          </Box>
          <Flex alignItems="center">
            {showRarity && (
              <>
                <P
                  color="rgba(255,255,255,0.9)"
                  display={["none", "none", "block", "block"]}
                >
                  {rarityDescription(lootRarity(attributes.map(a => a.value)))}
                </P>
                <Box
                  width={12}
                  height={12}
                  borderRadius="50%"
                  ml={2}
                  bg={rarityColor(lootRarity(attributes.map(a => a.value)))}
                />
              </>
            )}
            {showGreatness && (
              <P width={column} textAlign="right">
                {metaData ? metaData.scores.greatness : 0}
              </P>
            )}
          </Flex>
        </Flex>
        {attributes.map(item => (
          <Flex
            key={item.value}
            py={3}
            px={[3, 3, 4]}
            alignItems="ceter"
            borderTop="1px solid rgba(255,255,255,0.1)"
          >
            <Box flex={1}>
              <P fontSize={14} color="rgba(255,255,255, 0.8)" mr={3}>
                {item.key}
              </P>
              <P color="white" fontSize={16} fontWeight={600}>
                {item.value}
              </P>
            </Box>
            <Flex alignItems="center">
              {showRarity && (
                <>
                  <P
                    color="rgba(255,255,255,0.9)"
                    display={["none", "none", "block", "block"]}
                  >
                    {rarityDescription(itemRarity(item.value))}
                  </P>
                  <Box
                    width={12}
                    height={12}
                    borderRadius="50%"
                    ml={2}
                    bg={rarityColor(item.value)}
                  />
                </>
              )}
              {showGreatness && (
                <P width={column} textAlign="right">
                  {metaData ? metaData.greatness[item.key] : 0}
                </P>
              )}
            </Flex>
          </Flex>
        ))}
      </Box>
    </Pane>
  );
};

export default LootAttributeTable;
