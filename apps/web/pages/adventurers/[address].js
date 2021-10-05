import { useEffect, useState } from "react";
import { Flex, Box, P, Grid, Select } from "@ui";
import Link from "next/link";
import { useRouter } from "next/router";
import NFT from "@ui/organisms/NFT";
import Owner from "@ui/organisms/Owner";
import Header from "@ui/organisms/Header";
import { FaEye } from "react-icons/fa";

import useWallet from "@hooks/useWallet";
import useBags from "@hooks/useBags";

const Adventurer = ({}) => {
  const router = useRouter();
  const { address } = router.query;

  const [lens, setLens] = useState("characters");

  const { bags } = useBags({
    owner: address,
    skip: !address,
    limit: 400,
    filter: "all"
  });

  const wallet = useWallet(address);
  const bagsHeld = bags.length;

  return (
    <Flex flex={1} flexDirection="column" bg="black">
      <Header />
      <Flex justifyContent="space-between" p={3} pb={2}>
        <Box>
          <Owner address={address || ""} name={wallet.shortName || ""} large />
          <Box mt={3}>
            <P>
              {bagsHeld} {bagsHeld > 1 || bagsHeld == 0 ? "Bags" : "Bag"}
            </P>
          </Box>
        </Box>
        <Box>
          <Select
            onChange={e => setLens(e.target.value)}
            icon={<FaEye color="rgba(255,255,255,0.9)" />}
          >
            <option value="characters">Character</option>
            <option value="loot">Loot</option>
          </Select>
        </Box>
      </Flex>
      <Box p={3} pt={0}>
        <Grid>
          {bags.map(loot => (
            <Link
              key={loot.tokenId}
              href={`/bags/${loot.tokenId}`}
              style={{ textDecoration: "none" }}
            >
              <a>
                <NFT bag={loot} lens={lens} noName />
              </a>
            </Link>
          ))}
        </Grid>
      </Box>
    </Flex>
  );
};

export default Adventurer;
