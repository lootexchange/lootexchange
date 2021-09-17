import { GlobalContext } from 'context/GlobalState'
import { GetStaticProps, GetStaticPaths } from 'next'
import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import slugify from 'slugify'
import { processRarityData } from 'lib/processApiData'

type Props = {
  data: any
}

const Filtering = ({ data: apiData }: Props) => {
  const router = useRouter()
  const {
    state: {
      filteredAttributes,
      data,
      filteredData: { attributes, nfts },
    },
    dispatch,
  } = useContext(GlobalContext)

  useEffect(() => dispatch({ type: 'LOAD_DATA', payload: apiData }), [])

  useEffect(() => {
    if (!router.isReady) return
    dispatch({ type: 'APPLY_URL_FILTERS', payload: router.query })
  }, [router.isReady])

  return (
    <div className="flex gap-3 justify-center">
      <div>
        {attributes.map(({ name, traits }, attributeIndex) => {
          // Skip the first index, because it's not needed
          if (attributeIndex > 0) {
            return (
              <article className="mb-3" key={`${name}${attributeIndex}`}>
                <p className="font-bold">Trait: {name}</p>
                {/* Loop through all attributes */}
                {traits.map(({ name, count, active }, traitIndex) => (
                  <button
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
                    className={`flex gap-1 py-2 my-1 ${
                      active ? 'bg-red-800' : ''
                    } ${count === 0 ? 'opacity-60 cursor-not-allowed' : ''}`}
                    key={`${name}${traitIndex}`}
                  >
                    <span>{name}</span>
                    <span>{count}</span>
                  </button>
                ))}
              </article>
            )
          }
          return null
        })}
      </div>
      <div>
        {nfts.map((arr) => {
          let obj: any = {}
          arr.forEach((val, idx) => {
            if (idx === 0) {
              obj.id = val
            } else {
              obj[attributes[idx].name] = attributes[idx].traits[val].name
            }
          })
          return <pre key={arr[0]}>{JSON.stringify(obj, null, 2)}</pre>
        })}
      </div>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {
        params: {
          slug: 'cryptopunks',
        },
      },
    ],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params: { slug } }) => {
  let res = await fetch(
    `https://projects.rarity.tools/static/staticdata/${slug}.json`
  )

  const rawData = await res.json()

  if (!rawData) {
    return {
      notFound: true,
    }
  }

  const data = processRarityData(rawData)

  return {
    props: { data },
  }
}

export default Filtering
