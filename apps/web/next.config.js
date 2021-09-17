module.exports = {
  images: {
    domains: ['lh3.googleusercontent.com', 'storage.opensea.io'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/collection/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7',
        permanent: false,
      },
    ]
  },
}
