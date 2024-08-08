Ext.define('Dashboard.store.paymentTypes.api.PaymentTypeStore', {
    extend: 'Ext.data.Store',
    storeId: 'paymentTypeStore',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: '/paymentTypes/api',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});