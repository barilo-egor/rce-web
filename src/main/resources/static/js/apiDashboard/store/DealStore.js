Ext.define('ApiDashboard.store.DealStore', {
    extend: 'Ext.data.Store',
    storeId: 'dealStore',

    autoLoad: false,
    remoteSort: true,
    pageSize: 20,
    proxy: {
        type: 'rest',
        paramsAsJson: true,
        actionMethods: {
            read: 'POST'
        },
        url: '/dashboard/api/deal/findAll',
        reader: {
            type: 'json',
            rootProperty: 'items'
        }
    },

    listeners: {
        beforeload: function(me, operation) {
            operation.setParams(me.getFiltersFromPanel())
        }
    },

    fieldsReferences: [
        'pidFilterField', 'dateFilterField', 'fiatCurrencyFilterField',
        'cryptoCurrencyFilterField', 'dealTypeFilterField', 'dealStatusFilterField'
    ],

    getFiltersFromPanel: function() {
        let searchForm = {}
        for (let fieldReference of this.fieldsReferences) {
            let value = ExtUtil.referenceQuery(fieldReference).getValue()
            if (value === null || (typeof value === 'string' && value.trim().length === 0)) continue
            searchForm[fieldReference.substring(0, fieldReference.indexOf('FilterField'))] = value
        }
        return searchForm
    }
})