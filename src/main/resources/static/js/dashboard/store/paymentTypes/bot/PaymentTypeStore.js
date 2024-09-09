Ext.define('Dashboard.store.paymentTypes.bot.PaymentTypeStore', {
    extend: 'Ext.data.Store',
    storeId: 'paymentTypeStore',
    autoLoad: false,
    pageSize: 0,
    proxy: {
        type: 'ajax',
        url: '/paymentTypes/bot',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});