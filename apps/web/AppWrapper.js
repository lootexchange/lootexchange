import { ThemeProvider } from "@emotion/react";
import { RecoilRoot } from "recoil";
import { ClientContext } from "graphql-hooks";

import client from "./graphqlClient";
import theme from "./theme";

const AppWrapper = ({ children }) => (
  <RecoilRoot>
    <ThemeProvider theme={theme}>
      <ClientContext.Provider value={client}>{children}</ClientContext.Provider>
    </ThemeProvider>
  </RecoilRoot>
);

export default AppWrapper;
