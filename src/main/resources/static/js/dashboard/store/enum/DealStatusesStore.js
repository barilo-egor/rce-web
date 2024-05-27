Ext.define('Dashboard.store.enum.DealStatusesStore', {
    extend: 'Ext.data.Store',
    alias: 'store.dealStatusesStore',
    storeId: 'dealStatusesStore',
    fields: ['name', 'displayName'],
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: '/enum/dealStatuses',
        reader: {
            type: 'json',
            rootProperty: 'body.data'
        }
    }
});