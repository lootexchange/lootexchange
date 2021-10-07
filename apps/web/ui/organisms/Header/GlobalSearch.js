import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import styled from "@emotion/styled";
import { Box, P } from "@ui";
import Link from "next/link";
import { ethers } from "ethers";
import eth from "../../../ethers";
import Input from "./SearchInput";
import { shortenAddress } from "@utils";

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
  bag: "bags",
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

  const handleSearch = async () => {
    let bagNum = parseInt(debouncedQuery);

    if (bagNum && bagNum > 0 && bagNum < 7801) {
      return setResults([{ type: "bag", label: "Bag " + bagNum, id: bagNum }]);
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
        placeholder="Search for a Project"
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
