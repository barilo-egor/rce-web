Ext.define('Dashboard.store.paymentTypes.api.ApiRequisiteStore', {
    extend: 'Ext.data.Store',
    storeId: 'apiRequisiteStore',
    autoLoad: false,
    pageSize: 0,
    proxy: {
        type: 'ajax',
        url: '/paymentTypes/api/requisite',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});