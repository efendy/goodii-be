module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/orders/:uid',
      handler: 'order.findOne',
    },
    {
      method: 'PUT',
      path: '/orders/:uid',
      handler: 'order.update',
    }
  ]
}
