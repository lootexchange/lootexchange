import { SDK, FixedPriceOrderBuilder } from '@georgeroman/wyvern-v2-sdk'
import Layout from 'components/Layout'
import { GlobalContext } from 'context/GlobalState'
import { initWeb3 } from 'lib/web3'
import { useContext, useEffect } from 'react'
import { AddressZero } from '@ethersproject/constants'
import { GetStaticProps } from 'next'

// GET A RANDOM ORDER (RINKEBY)
// https://rinkeby-api.opensea.io/wyvern/v1/orders?bundled=false&include_bundled=false&include_invalid=false&limit=20&offset=0&order_by=created_date&order_direction=desc

const Order = () => {
  // Create (OSC) ERC721 token
  // 0x7dca125b1e805dC88814aeD7ccc810f677d3E1DB

  const { exchange, match, sign } = new SDK(
    '0x7be8076f4ea4a4ad08075c2508e481d6c946d12b'
  )

  const { dispatch } = useContext(GlobalContext)

  // Create sell order
  const sellOrder = FixedPriceOrderBuilder.erc721Sell({
    maker: '0x6f94f006f835def155c2b3f7cd192a16ca49b32e',
    target: '0x7dca125b1e805dC88814aeD7ccc810f677d3E1DB',
    tokenId: 139000413,
    paymentToken: AddressZero,
    basePrice: '4440000000000000000',
    fee: 1000,
    feeRecipient: '0x5b3256965e7c3cf26e11fcaf296dfc8807c01073',
    listingTime: 1630308958,
    expirationTime: 0,
    salt: '75092149502324763588184864009141223501858099406175488220197072601352327463144',
  })

  // Ensure all elements have access to web3Modal
  useEffect(() => initWeb3(dispatch), [])

  return (
    <Layout title="SDK">
      <div>Hello World!</div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(
    'https://rinkeby-api.opensea.io/wyvern/v1/orders?bundled=false&include_bundled=false&include_invalid=false&limit=20&offset=0&order_by=created_date&order_direction=desc'
  )
  const data = await res.json()

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: { data },
  }
}

export default Order

// Example order

// {
//     "id": 681538720,
//     "asset": {
//       "id": 17598832,
//       "token_id": "4355",
//       "num_sales": 1,
//       "background_color": "f3f3f3",
//       "image_url": "https://lh3.googleusercontent.com/3wwWF0bucvxW2fcvzAZe8lhQn0DpD4mPg-ozTEX2UkVDqqh_vvIO3SyAi0k0xJZfV1X_7b9n_d331Fx1-Yea7L-tQOvXL_NjZzRsJv4",
//       "image_preview_url": "https://lh3.googleusercontent.com/3wwWF0bucvxW2fcvzAZe8lhQn0DpD4mPg-ozTEX2UkVDqqh_vvIO3SyAi0k0xJZfV1X_7b9n_d331Fx1-Yea7L-tQOvXL_NjZzRsJv4=s250",
//       "image_thumbnail_url": "https://lh3.googleusercontent.com/3wwWF0bucvxW2fcvzAZe8lhQn0DpD4mPg-ozTEX2UkVDqqh_vvIO3SyAi0k0xJZfV1X_7b9n_d331Fx1-Yea7L-tQOvXL_NjZzRsJv4=s128",
//       "image_original_url": "https://map.cryptovoxels.com/tile/parcel?x=6.07&y=4.68",
//       "animation_url": null,
//       "animation_original_url": null,
//       "name": "3 Via Francesco Sforza",
//       "description": "99m² parcel on Milan, 759m from the origin, with a 10m build height, floor is at 0m elevation",
//       "external_link": "https://www.cryptovoxels.com/parcels/4355",
//       "asset_contract": {
//         "address": "0x79986af15539de2db9a5086382daeda917a9cf0c",
//         "asset_contract_type": "non-fungible",
//         "created_date": "2018-06-11T19:08:44.720025",
//         "name": "Cryptovoxels",
//         "nft_version": "3.0",
//         "opensea_version": null,
//         "owner": 94343,
//         "schema_name": "ERC721",
//         "symbol": "CVPA",
//         "total_supply": null,
//         "description": "A virtual world on the Ethereum blockchain. Build, develop, and sell property on the blocks and streets of Cryptovoxels. Users own the land and assets, with ownership and trading history recorded permanently on the blockchain. Trade land NFTs right here on OpenSea, and keep track of the Cryptovoxels team on Twitter for news on the latest drops and developments.",
//         "external_link": "https://www.cryptovoxels.com/",
//         "image_url": "https://lh3.googleusercontent.com/Jy6UrKMSi0e9w9jYtC1ON-4tOVXA1mXLk7XCLxvWEDuXeLFExJSYnw2DLAGtP3Ly98WJbrrFm6xEodcrpGnKB2tF=s60",
//         "default_to_fiat": false,
//         "dev_buyer_fee_basis_points": 0,
//         "dev_seller_fee_basis_points": 750,
//         "only_proxied_transfers": false,
//         "opensea_buyer_fee_basis_points": 0,
//         "opensea_seller_fee_basis_points": 250,
//         "buyer_fee_basis_points": 0,
//         "seller_fee_basis_points": 1000,
//         "payout_address": "0x2d891ed45c4c3eab978513df4b92a35cf131d2e2"
//       },
//       "permalink": "https://opensea.io/assets/0x79986af15539de2db9a5086382daeda917a9cf0c/4355",
//       "collection": {
//         "banner_image_url": "https://storage.opensea.io/static/banners/cryptovoxels-banner4.png",
//         "chat_url": null,
//         "created_date": "2019-04-26T22:13:21.329117",
//         "default_to_fiat": false,
//         "description": "A virtual world on the Ethereum blockchain. Build, develop, and sell property on the blocks and streets of Cryptovoxels. Users own the land and assets, with ownership and trading history recorded permanently on the blockchain. Trade land NFTs right here on OpenSea, and keep track of the Cryptovoxels team on Twitter for news on the latest drops and developments.",
//         "dev_buyer_fee_basis_points": "0",
//         "dev_seller_fee_basis_points": "750",
//         "discord_url": "https://discord.gg/Bv68xT4",
//         "display_data": {
//           "card_display_style": "padded"
//         },
//         "external_url": "https://www.cryptovoxels.com/",
//         "featured": true,
//         "featured_image_url": "https://storage.opensea.io/0x79986af15539de2db9a5086382daeda917a9cf0c-featured-1556589441.png",
//         "hidden": false,
//         "safelist_request_status": "verified",
//         "image_url": "https://lh3.googleusercontent.com/Jy6UrKMSi0e9w9jYtC1ON-4tOVXA1mXLk7XCLxvWEDuXeLFExJSYnw2DLAGtP3Ly98WJbrrFm6xEodcrpGnKB2tF=s60",
//         "is_subject_to_whitelist": false,
//         "large_image_url": "https://lh3.googleusercontent.com/Jy6UrKMSi0e9w9jYtC1ON-4tOVXA1mXLk7XCLxvWEDuXeLFExJSYnw2DLAGtP3Ly98WJbrrFm6xEodcrpGnKB2tF",
//         "medium_username": null,
//         "name": "Cryptovoxels",
//         "only_proxied_transfers": false,
//         "opensea_buyer_fee_basis_points": "0",
//         "opensea_seller_fee_basis_points": "250",
//         "payout_address": "0x2d891ed45c4c3eab978513df4b92a35cf131d2e2",
//         "require_email": false,
//         "short_description": null,
//         "slug": "cryptovoxels",
//         "telegram_url": null,
//         "twitter_username": "cryptovoxels",
//         "instagram_username": null,
//         "wiki_url": null
//       },
//       "decimals": 0,
//       "token_metadata": "https://www.cryptovoxels.com/p/4355",
//       "owner": {
//         "user": {
//           "username": "theRealPeel"
//         },
//         "profile_img_url": "https://storage.googleapis.com/opensea-static/opensea-profile/13.png",
//         "address": "0x841ae9ec0753a2514ccf618229f980c95e1e1594",
//         "config": ""
//       }
//     },
//     "asset_bundle": null,
//     "created_date": "2021-09-08T22:19:49.289660",
//     "closing_date": "2021-09-09T02:19:24",
//     "closing_extendable": false,
//     "expiration_time": 1631153964,
//     "listing_time": 1631139464,
//     "order_hash": "0x162493a6fdb69fef1b0a41328fa2d36591b87d626cab170b9a57a308cc4a9305",
//     "metadata": {
//       "asset": {
//         "id": "4355",
//         "address": "0x79986af15539de2db9a5086382daeda917a9cf0c"
//       },
//       "schema": "ERC721",
//       "referrerAddress": ""
//     },
//     "exchange": "0x7be8076f4ea4a4ad08075c2508e481d6c946d12b",
//     "maker": {
//       "user": {
//         "username": "voxelmaster42069"
//       },
//       "profile_img_url": "https://storage.googleapis.com/opensea-static/opensea-profile/28.png",
//       "address": "0xfa97c8b9d289fd2a66e1fb14557f53b6d818d0b5",
//       "config": ""
//     },
//     "taker": {
//       "user": {
//         "username": "NullAddress"
//       },
//       "profile_img_url": "https://storage.googleapis.com/opensea-static/opensea-profile/1.png",
//       "address": "0x0000000000000000000000000000000000000000",
//       "config": ""
//     },
//     "current_price": "1053800000000000000.000000000",
//     "current_bounty": "10538000000000000",
//     "bounty_multiple": "0.01",
//     "maker_relayer_fee": "0",
//     "taker_relayer_fee": "1000",
//     "maker_protocol_fee": "0",
//     "taker_protocol_fee": "0",
//     "maker_referrer_fee": "0",
//     "fee_recipient": {
//       "user": {
//         "username": "OS-Wallet"
//       },
//       "profile_img_url": "https://storage.googleapis.com/opensea-static/opensea-profile/28.png",
//       "address": "0x5b3256965e7c3cf26e11fcaf296dfc8807c01073",
//       "config": "verified"
//     },
//     "fee_method": 1,
//     "side": 0,
//     "sale_kind": 0,
//     "target": "0x79986af15539de2db9a5086382daeda917a9cf0c",
//     "how_to_call": 0,
//     "calldata": "0x23b872dd0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000fa97c8b9d289fd2a66e1fb14557f53b6d818d0b50000000000000000000000000000000000000000000000000000000000001103",
//     "replacement_pattern": "0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
//     "static_target": "0x0000000000000000000000000000000000000000",
//     "static_extradata": "0x",
//     "payment_token": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
//     "payment_token_contract": {
//       "id": 2,
//       "symbol": "WETH",
//       "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
//       "image_url": "https://storage.opensea.io/files/accae6b6fb3888cbff27a013729c22dc.svg",
//       "name": "Wrapped Ether",
//       "decimals": 18,
//       "eth_price": "1.000000000000000",
//       "usd_price": "3492.630000000000109000"
//     },
//     "base_price": "1053800000000000000",
//     "extra": "0",
//     "quantity": "1",
//     "salt": "62475299251722426279905008884552675029754469188790260980547949969327909765414",
//     "v": 27,
//     "r": "0xdcab8971d404e77f5593f6afdccdf7617ceba8273c9529a10924f20c45936927",
//     "s": "0x25ff2bc8b37addea10d0299bbf087ed991d31397b38cf4cb167dab8f19f3f15a",
//     "approved_on_chain": false,
//     "cancelled": false,
//     "finalized": false,
//     "marked_invalid": false,
//     "prefixed_hash": "0x2168abf4f53c600b7160f15b0e678051d1960c5b7a28062a0634db83153447c7"
//   },
