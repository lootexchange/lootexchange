import { Box, P } from "@ui";
import { useEffect, useState } from "react";

import Input from "./SearchInput";
import Link from "next/link";
import eth from "../../../ethers";
import { ethers } from "ethers";
import { shortenAddress } from "@utils";
import styled from "@emotion/styled";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/router";

const SearchContainer = styled.div`
  position: absolute;
  top: 47px;
  z-index: 100;
  left: 0;
  background: #0d0d0d;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  right: 0;
  overflow: hidden;
  maxheight: 500px;
`;

const ItemWrapper = styled(Box)`
  background: #0d0d0d;
  cursor: pointer;

  transition: background 300ms ease-in-out;

  &:hover {
    background: #282828;
  }
`;

const routeMap = {
  loot: "collections/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7",
  genesis: "collections/0x8db687aceb92c66f013e1d614137238cc698fedb",
  mLoot: "collections/0x1dfe7ca09e99d10835bf73044a23b73fc20623df",
  address: "adventurers",
  item: "items"
};

const SearchResults = ({ results, handleSelection }) => {
  if (results.length === 0) {
    return false;
  }

  return (
    <SearchContainer>
      {results.slice(0, 8).map(result => {
        return (
          <Link
            key={result.id + result.type}
            href={`/${routeMap[result.type]}/${result.id}`}
            style={{ textDecoration: "none" }}
          >
            <ItemWrapper p={3} onClick={handleSelection}>
              <P>{result.label}</P>
            </ItemWrapper>
          </Link>
        );
      })}
    </SearchContainer>
  );
};

const GlobalSearch = props => {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState([]);
  const router = useRouter();

  const handleSearch = async () => {
    let bagNum = parseInt(debouncedQuery);

    if (bagNum && bagNum > 0 && bagNum < 8001) {
      let genesis = {
        type: "genesis",
        label: "Genesis Adventurer #" + bagNum,
        id: bagNum
      };

      return setResults([
        { type: "loot", label: "Loot Bag #" + bagNum, id: bagNum },
        ...(bagNum > 2540 ? [] : [genesis])
      ]);
    }

    if (bagNum && bagNum >= 8001 && bagNum < 124411) {
      return setResults([
        { type: "mLoot", label: "mLoot Bag #" + bagNum, id: bagNum }
      ]);
    }

    if (ethers.utils.isAddress(debouncedQuery)) {
      return setResults([
        {
          type: "address",
          label: "Wallet: " + shortenAddress(debouncedQuery),
          id: debouncedQuery
        }
      ]);
    }

    if (/.*\.eth$/.test(debouncedQuery) && eth.provider) {
      let address = await eth.provider.resolveName(debouncedQuery);

      if (address) {
        return setResults([
          {
            type: "address",
            label: "Wallet: " + debouncedQuery,
            id: address
          }
        ]);
      }
    }

    return setResults([]);

    const response = await fetch(`/api/searchItems?q=${debouncedQuery}`);
    const results = await response.json();

    return setResults(
      results.map(result => ({
        type: "item",
        label: result.name,
        id: result.id
      }))
    );

    setResults([]);
  };

  useEffect(() => {
    if (debouncedQuery.length > 0) {
      handleSearch();
    }
  }, [debouncedQuery]);

  const handleKeyDown = e => {
    if (e.keyCode === 13) {
      let result = results[0];

      router.push(`/${routeMap[result.type]}/${result.id}`);
      setResults([]);
      setQuery("");
    }
  };

  return (
    <Box {...props} position="relative">
      <Input
        style={{
          borderBottomRightRadius: results.length ? 0 : 10,
          borderBottomLeftRadius: results.length ? 0 : 10
        }}
        value={query}
        placeholder="Search by bag #, address, or ens"
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <SearchResults
        results={results}
        handleSelection={() => {
          setResults([]);
          setQuery("");
        }}
      />
    </Box>
  );
};

export default GlobalSearch;
