Ext.define('Dashboard.store.users.web.WebUserStore', {
    extend: 'Ext.data.Store',
    storeId: 'webUserStore',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: '/users/web/findAll',
        reader: {
            type: 'json',
            rootProperty: 'body.data'
        }
    }
})