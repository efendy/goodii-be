module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/payment-transactions/uid/:uid',
      handler: 'payment-transaction.findOneByUid',
    },
    {
      method: 'PUT',
      path: '/payment-transactions/uid/:uid',
      handler: 'payment-transaction.updateByUid',
    },
    {
      method: 'GET',
      path: '/wallet/:shopId',
      handler: 'payment-transaction.getUnclaimedAmount',
    }
  ]
}
