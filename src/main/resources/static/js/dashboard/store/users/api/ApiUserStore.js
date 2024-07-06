Ext.define('Dashboard.store.users.api.ApiUserStore', {
    extend: 'Ext.data.Store',
    storeId: 'apiUserStore',
    autoLoad: true,
    fields: [
        {
            name: 'registrationDate',
            type: 'date'
        },
    ],
    proxy: {
        type: 'ajax',
        url: '/users/api/findAll',
        reader: {
            type: 'json',
            rootProperty: 'body.data'
        }
    },

    fieldsReferences: ['idFilterField', 'fiatCurrencyFilterField', 'tokenFilterField', 'buyRequisiteFilterField',
        'sellRequisiteFilterField']
})