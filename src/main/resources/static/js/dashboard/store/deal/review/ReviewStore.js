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
    },
    listeners: {
        load: function (me, records) {
            records.forEach(record => record.set('selected', Ext.getStore(PUBLISHED_REVIEW_STORE_ID).find('pid', record.get('pid')) > -1))
        }
    }
})