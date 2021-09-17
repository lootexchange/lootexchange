import React, { ReactNode } from 'react'
import Head from 'next/head'
import Navbar from './Navbar'

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'Loot Exchange' }: Props) => (
  <main className="px-2 sm:px-4 xl:px-0 my-3 max-w-screen-lg mx-auto">
    <Head>
      <title>{title}</title>
    </Head>
    <Navbar />
    {children}
  </main>
)

export default Layout
