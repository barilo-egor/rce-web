Ext.define('Dashboard.store.paymentTypes.api.ApiClientStore', {
    extend: 'Ext.data.Store',
    storeId: 'apiClientStore',
    autoLoad: false,
    pageSize: 0,
    proxy: {
        type: 'ajax',
        url: '/paymentTypes/api/client',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});