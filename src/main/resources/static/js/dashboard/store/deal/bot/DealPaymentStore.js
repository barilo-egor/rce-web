Ext.define('Dashboard.store.deal.bot.DealPaymentStore', {
    extend: 'Ext.data.Store',
    storeId: 'dealPaymentStore',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: '/deal/payment/findAll',
        reader: {
            type: 'json',
            rootProperty: 'body.data'
        }
    }
});