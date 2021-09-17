import { GlobalContext } from 'context/GlobalState'
import Image from 'next/image'
import { useContext } from 'react'

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

const Roulette = () => {
  const {
    state: { openSeaCollection },
  } = useContext(GlobalContext)

  if (!!openSeaCollection) {
    return (
      <figure className="h-80 w-80 mx-auto relative">
        <Image
          // @ts-ignore
          src={openSeaCollection[getRandomInt(20)].image_url}
          alt="Bored Ape"
          layout="fill"
          objectFit="contain"
        />
      </figure>
    )
  }
  return null
}

export default Roulette
