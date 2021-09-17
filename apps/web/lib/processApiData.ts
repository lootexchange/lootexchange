interface IBasePropDef {
  name: string
  type: string
  weight?: number
  pvs?: [name: string | number | null, count: number, active: number][]
}

type Item = (string | number)[]

interface RarityData {
  basePropDefs: IBasePropDef[]
  items: Item[]
}

function processBasePropDefs(basePropDefs: IBasePropDef[]) {
  return basePropDefs.map(({ name, pvs }) => {
    if (!!pvs) {
      return {
        name,
        traits: pvs.map(([name]) =>
          name === null ? { name: 'NOT_SET' } : { name: `${name}` }
        ),
      }
    } else {
      return {
        name,
        traits: [
          {
            name: 'primaryKey',
          },
        ],
      }
    }
  })
}

function processItems(items: Item[], basePropDefsLength: number) {
  // make sure that the lenght of the array is the same as the amount
  // of props
  return items.map((item) => item.slice(0, basePropDefsLength))
}

export function processRarityData({ basePropDefs, items }: RarityData) {
  const attributes = processBasePropDefs(basePropDefs)
  const nfts = processItems(items, attributes.length)

  return {
    attributes,
    nfts,
  }
}
