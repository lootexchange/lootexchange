import { useEffect } from "react";
import { ThemeProvider } from "@emotion/react";
import { RecoilRoot } from "recoil";
import { ClientContext } from "graphql-hooks";

import client from "./graphqlClient";
import theme from "./theme";
import { currentUser as currentUserAtom } from "./atoms";

import AuthWrapper from "./AuthWrapper";
import ChainWrapper from "./ChainWrapper";

const AppWrapper = ({ children }) => {
  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <ClientContext.Provider value={client}>
          <AuthWrapper>
            <ChainWrapper>{children}</ChainWrapper>
          </AuthWrapper>
        </ClientContext.Provider>
      </ThemeProvider>
    </RecoilRoot>
  );
};

export default AppWrapper;
