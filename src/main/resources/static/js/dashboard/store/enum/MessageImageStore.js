Ext.define('Dashboard.store.enum.MessageImageStore', {
    extend: 'Ext.data.Store',
    storeId: 'messageImageStore',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: '/enum/messageImages',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});