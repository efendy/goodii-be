module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/listings/retrieve',
      handler: 'listing.getByUIDs',
    },
  ]
}
