export type TCollection = {
  id: string
  slug: string
  name: string
  created_date: string | null
  description: string | null
  discord_url: string | null
  external_url: string | null
  image_url: string | null
  large_image_url: string | null
  banner_image_url: string | null
  medium_username: string | null
  twitter_username: string | null
  instagram_username: string | null
  stats: {
    one_day_volume: number
    one_day_change: number
    one_day_sales: number
    one_day_average_price: number
    seven_day_volume: number
    seven_day_change: number
    seven_day_sales: number
    seven_day_average_price: number
    total_volume: number
    total_sales: number
    total_supply: number
    num_owners: number
    average_price: number
    market_cap: number
    floor_price: number
  }
}

export interface GenieTokenList {
  name: string
  timestamp: string
  version: {
    major: number
    minor: number
    patch: number
  }
  tags: {}
  logoURI: string
  keywords: string[]
  tokens: {
    name: string
    chainId: number
    address: string
    standard: string
    symbol: string
    logoURI: string
  }[]
}
