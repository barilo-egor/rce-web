Ext.define('Dashboard.store.enum.DeliveryTypesStore', {
    extend: 'Ext.data.Store',
    alias: 'store.deliveryTypesStore',
    storeId: 'deliveryTypesStore',
    fields: ['name', 'displayName'],
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: '/enum/deliveryTypes',
        reader: {
            type: 'json',
            rootProperty: 'body.data'
        }
    }
});