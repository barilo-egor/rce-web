Ext.define('Dashboard.store.deal.api.ApiDealStore', {
    extend: 'Ext.data.Store',
    storeId: 'apiDealStore',
    autoLoad: false,
    remoteSort: true,
    pageSize: 20,
    proxy: {
        type: 'rest',
        paramsAsJson: true,
        actionMethods: {
            read: 'POST'
        },
        url: '/deal/api/findAll',
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
        'pidFilterField', 'apiUserIdFilterField', 'dateFilterField', 'fiatCurrencyFilterField',
        'cryptoCurrencyFilterField', 'dealTypeFilterField', 'dealStatusFilterField',
        'requisiteFilterField'
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