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
    },
    {
      method: 'GET',
      path: '/earnings/:shopId',
      handler: 'order.getMonthlyEarning',
    }
  ]
}
