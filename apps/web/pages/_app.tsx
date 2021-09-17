import 'tailwindcss/tailwind.css'
import { GlobalProvider } from 'context/GlobalState'
import { AppProps } from 'next/app'

const MyApp = ({ Component, pageProps }: AppProps) => (
  <GlobalProvider>
    <Component {...pageProps} />
  </GlobalProvider>
)

export default MyApp
