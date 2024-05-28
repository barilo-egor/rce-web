Ext.define('Dashboard.store.enum.ApiDealStatusesStore', {
    extend: 'Ext.data.Store',
    alias: 'store.apiDealStatusesStore',
    storeId: 'apiDealStatusesStore',
    fields: ['name', 'description'],
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: '/enum/apiDealStatuses',
        reader: {
            type: 'json',
            rootProperty: 'body.data'
        }
    }
});