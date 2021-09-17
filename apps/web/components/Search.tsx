import { GlobalContext } from 'context/GlobalState'
import React, { useContext, useState } from 'react'
import { HiSearch } from 'react-icons/hi'
import Image from 'next/image'
import ModalBackground from './Modal'
import Link from 'next/link'
import { Collections } from 'interfaces/context'
import { matchSorter } from 'match-sorter'

const Search = () => {
  const {
    state: { collections },
  } = useContext(GlobalContext)
  const [results, setResults] = useState<Collections>([])
  const [query, setQuery] = useState('')

  return (
    <article className="relative flex rounded ring-1 ring-trueGray-700">
      <HiSearch className="absolute top-1 left-1 h-6 w-6 text-trueGray-500" />
      <input
        className="pl-8 w-full transition bg-transparent focus:shadow focus:outline-none rounded ring-1 ring-trueGray-300 dark:ring-trueGray-700 focus:ring-trueGray-400 focus:dark:ring-trueGray-500 focus:bg-trueGray-50 focus:dark:bg-trueGray-900"
        type="search"
        autoComplete="off"
        id="search"
        value={query}
        placeholder="Search by name or address"
        name="search"
        onChange={(e) => {
          setQuery(e.target.value)
          setResults(
            matchSorter(collections, e.target.value, {
              keys: ['name', 'address'],
            }).slice(0, 6)
          )
        }}
      />

      {/* Results */}
      {query !== '' && (
        <React.Fragment>
          <ModalBackground onClose={() => setQuery('')} />
          <div className="absolute z-10 space-y-1 p-2 top-10 w-full rounded bg-trueGray-50 dark:bg-trueGray-900 ring-1 ring-trueGray-300 dark:ring-trueGray-700">
            {results.length === 0 ? (
              <p className="my-2 px-2">Not found</p>
            ) : (
              results.map(({ name, id, image_url }) => (
                <Link href={`/collection/${id}`} key={name}>
                  <a
                    onClick={() => setQuery('')}
                    className="block px-2 py-1 rounded hover:bg-trueGray-200 hover:dark:bg-trueGray-800 text-trueGray-900 dark:text-trueGray-50 flex gap-2 items-center"
                  >
                    {/* TODO: image_url should never be undefined */}
                    <Image
                      src={
                        image_url !== undefined ? image_url : '/placeholder.jpg'
                      }
                      alt={`${name}'s logo.`}
                      width={30}
                      height={30}
                      className="rounded-full overflow-hidden"
                    />
                    {name}
                  </a>
                </Link>
              ))
            )}
          </div>
        </React.Fragment>
      )}
    </article>
  )
}
export default Search
