Ext.define('Dashboard.store.paymentTypes.bot.SecurePaymentDetailsStore', {
    extend: 'Ext.data.Store',
    storeId: 'securePaymentDetailsStore',
    autoLoad: false,
    pageSize: 0,
    proxy: {
        type: 'ajax',
        url: '/paymentTypes/bot/securePaymentDetails',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});