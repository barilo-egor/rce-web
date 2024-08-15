Ext.define('Dashboard.store.deal.review.ReviewStore', {
    extend: 'Ext.data.Store',
    storeId: 'reviewStore',
    autoLoad: false,
    remoteSort: true,
    pageSize: 50,
    proxy: {
        type: 'ajax',
        url: '/deal/review',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
})