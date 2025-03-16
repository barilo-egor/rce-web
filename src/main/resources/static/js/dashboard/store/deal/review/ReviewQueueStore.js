Ext.define('Dashboard.store.deal.review.ReviewQueueStore', {
    extend: 'Ext.data.Store',
    storeId: 'reviewQueueStore',
    autoLoad: false,
    remoteSort: true,
    pageSize: 50,
    proxy: {
        type: 'ajax',
        url: '/deal/review?isAccepted=true',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
})