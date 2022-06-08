module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/orders/:uid',
      handler: 'order.findOne',
    }
  ]
}
