import { useEffect } from "react";
import { ThemeProvider } from "@emotion/react";
import { RecoilRoot } from "recoil";
import { ClientContext } from "graphql-hooks";
import { DAppProvider } from "@usedapp/core";

import client from "./graphqlClient";
import theme from "./theme";
import { currentUser as currentUserAtom } from "./atoms";

const config = {
  readOnlyChainId: 1,
  readOnlyUrls: {
    1: "https://eth-mainnet.alchemyapi.io/v2/fs4lrnWP8rKa8o1yezUnJsFo4ViE92qI",
    4: "https://eth-rinkeby.alchemyapi.io/v2/Ps8SftArzLj8bzn10Y64bCc1IouNi99N"
  }
};

import AuthWrapper from "./AuthWrapper";
import ChainWrapper from "./ChainWrapper";

const AppWrapper = ({ children }) => {
  return (
    <RecoilRoot>
      <DAppProvider config={config}>
        <ThemeProvider theme={theme}>
          <ClientContext.Provider value={client}>
            <AuthWrapper>
              <ChainWrapper>{children}</ChainWrapper>
            </AuthWrapper>
          </ClientContext.Provider>
        </ThemeProvider>
      </DAppProvider>
    </RecoilRoot>
  );
};

export default AppWrapper;
