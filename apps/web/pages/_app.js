import "../styles/globals.css";
import AppWrapper from "../AppWrapper";
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
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
