import "../styles/globals.css";
import AppWrapper from "../AppWrapper";
import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";

import * as ga from "../lib/ga";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  router.events.on("routeChangeComplete", ga.pageview);

  return (
    <AppWrapper>
      <Head>
        <title>Loot Exchange</title>
      </Head>
      <Component {...pageProps} />
    </AppWrapper>
  );
}

export default MyApp;
