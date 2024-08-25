Ext.define('Dashboard.store.deal.bot.BotDealStore', {
    extend: 'Ext.data.Store',
    storeId: 'botDealStore',
    autoLoad: false,
    remoteSort: true,
    pageSize: 20,
    proxy: {
        type: 'rest',
        paramsAsJson: true,
        actionMethods: {
            read: 'POST'
        },
        url: '/deal/bot/findAll',
        reader: {
            type: 'json',
            rootProperty: 'items'
        }
    },

    listeners: {
        beforeload: function(me, operation) {
            operation.setParams(me.getFiltersFromPanel())
        },
        load: function () {
            ExtUtil.referenceQuery('litecoinBalanceField').reload()
        }
    },

    fieldsReferences: [
        'chatIdFilterField', 'usernameFilterField', 'dateFilterField', 'requisiteFilterField',
        'fiatCurrencyFilterField', 'cryptoCurrencyFilterField', 'dealTypeFilterField',
        'dealStatusFilterField', 'deliveryTypeFilterField', 'paymentTypeFilterField'
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