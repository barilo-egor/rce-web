Ext.define('Dashboard.store.enum.RoleStore', {
    extend: 'Ext.data.Store',
    storeId: 'roleStore',
    alias: 'store.roleStore',
    fields: [
        'name', 'displayName'
    ],
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: '/enum/roles',
        reader: {
            type: 'json',
            rootProperty: 'body.data'
        }
    }
});