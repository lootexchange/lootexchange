import makeBlockie from 'ethereum-blockies-base64'

export function shrinkAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

function getBlockie(address: string | undefined) {
  if (address) {
    return makeBlockie(address)
  }
  // TODO: add fallback img
  return ''
}

type Props = {
  address: string
}

const Blockie = ({ address }: Props) => (
  <figure className="flex gap-2 items-center">
    <img
      className="rounded h-6"
      src={getBlockie(address)}
      alt="Ethereum address' graphical representation (Blockie)."
    />
    <span className="font-mono pt-0.5">{shrinkAddress(address)}</span>
  </figure>
)

export default Blockie
