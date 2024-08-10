Ext.define('Dashboard.store.paymentTypes.api.RequisiteStore', {
    extend: 'Ext.data.Store',
    storeId: 'requisiteStore',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: '/paymentTypes/api/requisite',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});