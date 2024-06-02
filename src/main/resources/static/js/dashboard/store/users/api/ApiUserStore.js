Ext.define('Dashboard.store.users.api.ApiUserStore', {
    extend: 'Ext.data.Store',
    storeId: 'apiUserStore',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: '/users/api/findAll',
        reader: {
            type: 'json',
            rootProperty: 'body.data'
        }
    },

    fieldsReferences: ['usernameField', 'roleField', 'chatIdField']
})