import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Concert+One&family=Source+Code+Pro:wght@200;400;600;900&display=swap"
            rel="stylesheet"
          />
          <link rel="shortcut icon" type="image/svg" href="/exchangeIcon.svg" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@lootexchange" />
          <meta name="twitter:creator" content="@lootexchange" />
          <meta property="og:url" content="https://www.loot.exchange/" />
          <meta property="og:title" content="Loot Exchange" />
          <meta
            property="og:description"
            content="A community marketplace for the Loot Universe"
          />
          <meta
            property="og:image"
            content="https://avatars.githubusercontent.com/u/90751361?s=200&v=4"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
