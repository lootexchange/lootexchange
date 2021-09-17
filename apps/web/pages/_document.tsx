import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html className="bg-trueGray-100 text-trueGray-800 dark:bg-trueGray-800 dark:text-trueGray-100">
        <Head />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond&display=optional"
          rel="stylesheet"
        />
        {/* Must  */}
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Loot Exchange"
        />
        <meta name="keywords" content="loot, nft, ethereum, protocol" />


        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
