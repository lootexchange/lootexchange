import ConnectWeb3 from './ConnectWeb3'
import Search from './Search'

const Navbar = () => (
  <nav className="flex gap-2 sm:gap-4 justify-between mb-3">
    <p className="hidden whitespace-nowrap sm:block my-auto text-xl font-bold">
      ⚔️ Loot.Exchange
    </p>
    <Search />
    <ConnectWeb3 />
  </nav>
)

export default Navbar
