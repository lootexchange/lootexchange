import { GlobalContext } from 'context/GlobalState'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import slugify from 'slugify'
import React, { Fragment } from 'react'
import { Menu, Transition, Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'

const Sidebar = () => {
  const router = useRouter()
  const {
    state: {
      filteredAttributes,
      data,
      filteredData: { attributes },
    },
    dispatch,
  } = useContext(GlobalContext)

  return (
    <Menu as="nav" className="absolute">
      <Menu.Button className="fixed top-1/3 left-0 inline-flex justify-start px-4 py-2 m-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
        <p
          className="font-bold"
          style={{ textOrientation: 'upright', writingMode: 'vertical-lr' }}
        >
          FILTER
        </p>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 -translate-x-4"
        enterTo="transform opacity-100 translate-x-0"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 translate-x-0"
        leaveTo="transform opacity-0 -translate-x-4"
      >
        <Menu.Items
          className="fixed h-screen overflow-y-auto top-0 w-56 origin-left bg-trueGray-900 divide-y divide-trueGray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          unmount={false}
        >
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-trueGray-200 text-black' : 'text-trueGray-200'
                  } font-semibold group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                >
                  Close
                </button>
              )}
            </Menu.Item>
          </div>
          <div className="px-2 py-2 space-y-1.5">
            {attributes.map(({ name, traits }, attributeIndex) => {
              // Skip the first index, because it's not needed
              if (attributeIndex > 0) {
                return (
                  <Disclosure key={`${name}${attributeIndex}`}>
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="transition flex gap-2 items-center w-full px-2 py-1 text-sm font-medium text-left bg-trueGray-100 dark:bg-trueGray-800 rounded-lg hover:bg-trueGray-200 dark:hover:bg-trueGray-700 focus:outline-none focus-visible:ring focus-visible:ring-trueGray-500 focus-visible:ring-opacity-75">
                          <p className="font-bold p-1">{name}</p>
                          <ChevronUpIcon
                            className={`${
                              open ? 'transform rotate-180' : ''
                            } w-5 h-5 text-trueGray-500 dark:text-trueGray-400 ml-auto`}
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-1">
                          <input
                            className="px-1.5 py-0.5 text-sm w-full mb-1.5 transition bg-transparent focus:shadow focus:outline-none rounded ring-1 ring-trueGray-300 dark:ring-trueGray-700 focus:ring-trueGray-400 focus:dark:ring-trueGray-500 focus:bg-trueGray-50 focus:dark:bg-trueGray-900"
                            type="search"
                            autoComplete="off"
                            id="search"
                            placeholder="Search..."
                            name="search"
                            onChange={(e) =>
                              dispatch({
                                type: 'FILTER_TRAIT',
                                payload: {
                                  searchValue: e.target.value,
                                  attributeIndex,
                                },
                              })
                            }
                          />
                          <div className="text-sm max-h-[155px] overflow-y-auto">
                            {traits.map(
                              ({ name, count, active }, traitIndex) => (
                                <button
                                  key={`${name}${traitIndex}`}
                                  disabled={count === 0}
                                  onClick={() => {
                                    dispatch({
                                      type: 'UPDATE_FILTERED_ASSETS',
                                      payload: { attributeIndex, traitIndex },
                                    })
                                    // Update the URL queries
                                    setTimeout(() => {
                                      router.replace({
                                        // Remove queries from the root path
                                        pathname: router.asPath.split('?')[0],
                                        // Generate new queries
                                        query: new URLSearchParams(
                                          // Format: [null, 2, 4, 1, null, null]
                                          filteredAttributes
                                            .map((trait, idx) => {
                                              if (trait !== null) {
                                                return [
                                                  // Get the attribute name
                                                  // The idx + 1 is used to compesate for the
                                                  // first index, which will never be used
                                                  `${data.attributes[idx].name}`,
                                                  // Get the trait name
                                                  slugify(
                                                    `${data.attributes[idx].traits[trait].name}`
                                                  ),
                                                ]
                                              } else {
                                                return null
                                              }
                                            })
                                            .filter((item) => item !== null)
                                        ).toString(),
                                      })
                                    }, 100)
                                  }}
                                  className={`w-full items-center text-left rounded flex justify-between gap-3 px-2.5 py-1 ${
                                    !active ? 'hover:bg-trueGray-800' : ''
                                  } ${
                                    active
                                      ? 'bg-trueGray-200 text-trueGray-900 font-bold'
                                      : ''
                                  } ${
                                    count === 0
                                      ? 'opacity-60 cursor-not-allowed'
                                      : ''
                                  }`}
                                >
                                  <span>{name}</span>
                                  <span>{count}</span>
                                </button>
                              )
                            )}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                )
              }
              return null
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default Sidebar
